package isla.web.rest;

import com.codahale.metrics.annotation.Timed;

import isla.domain.Comment;
import isla.domain.Lecture;
import isla.repository.CommentRepository;
import isla.repository.LectureRepository;
import isla.repository.search.LectureSearchRepository;
import isla.web.rest.util.HeaderUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Lecture.
 */
@RestController
@RequestMapping("/api")
public class LectureResource {

    private final Logger log = LoggerFactory.getLogger(LectureResource.class);

    @Inject
    private LectureRepository lectureRepository;

    @Inject 
    private CommentRepository commentRepository;
    
    @Inject
    private LectureSearchRepository lectureSearchRepository;

    /**
     * POST  /lectures -> Create a new lecture.
     */
    @RequestMapping(value = "/lectures",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lecture> createLecture(@Valid @RequestBody Lecture lecture) throws URISyntaxException {
        log.debug("REST request to save Lecture : {}", lecture);
        if (lecture.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new lecture cannot already have an ID").body(null);
        }
        Lecture result = lectureRepository.save(lecture);
        lectureSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/lectures/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("lecture", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /lectures -> Updates an existing lecture.
     */
    @RequestMapping(value = "/lectures",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lecture> updateLecture(@Valid @RequestBody Lecture lecture) throws URISyntaxException {
        log.debug("REST request to update Lecture : {}", lecture);
        if (lecture.getId() == null) {
            return createLecture(lecture);
        }
        Lecture result = lectureRepository.save(lecture);
        lectureSearchRepository.save(lecture);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("lecture", lecture.getId().toString()))
                .body(result);
    }

    /**
     * GET  /lectures -> get all the lectures.
     */
    @RequestMapping(value = "/lectures",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Lecture> getAllLectures() {
        log.debug("REST request to get all Lectures");
        return lectureRepository.findAll();
    }
    /**
     * GET  /lectures/:id/comments -> get all the comments of lecture.
     */
    @RequestMapping(value = "/lectures/{id}/comments",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Comment>> getAllComments(Pageable pageable, @PathVariable Long id){
        return new ResponseEntity<>(commentRepository.findByPostedByLectureId(id), null, HttpStatus.OK);
    }

    /**
     * GET  /lectures/:id -> get the "id" lecture.
     */
    @RequestMapping(value = "/lectures/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Lecture> getLecture(@PathVariable Long id) {
        log.debug("REST request to get Lecture : {}", id);
        return Optional.ofNullable(lectureRepository.findOne(id))
            .map(lecture -> new ResponseEntity<>(
                lecture,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /lectures/:id -> delete the "id" lecture.
     */
    @RequestMapping(value = "/lectures/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteLecture(@PathVariable Long id) {
        log.debug("REST request to delete Lecture : {}", id);
        lectureRepository.delete(id);
        lectureSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("lecture", id.toString())).build();
    }

    /**
     * SEARCH  /_search/lectures/:query -> search for the lecture corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/lectures/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Lecture> searchLectures(@PathVariable String query) {
        return StreamSupport
            .stream(lectureSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}