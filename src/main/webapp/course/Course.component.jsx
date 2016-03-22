import React from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {fetchCourses} from './course';
import LectureForm from '../lecture/LectureForm.component';
import {addLecture} from '../lecture/lecture';
import LectureList from '../lecture/LectureList.component';
import RequireAuthoritory from '../util/RequireAuthority.component';

const mapStateToProps = state => (
  {course: state.getIn(['entities', 'courses'])
});

class Course extends React.Component {
  static contextTypes = {
    auth: React.PropTypes.object.isRequired
  }
  componentWillMount() {
    this.props.fetchCourses(this.props.routeParams.id);
  }
  shouldComponentUpdate(newProps, newState, newContext) {
    return !(
      this.props.course === newProps.course &&
      JSON.stringify(this.context) === JSON.stringify(newContext)
    );
  }
  render() {
    if (
      !this.props.course.get('isFetching') &&
      this.props.course instanceof Map
    ) {
      const course = this.props.course.toJS();
      const authorities = this.context.auth.user ?
        this.context.auth.user.authorities : null;
      return (
        <div className="course">
          <RequireAuthoritory
              authorities={authorities}
              item={
                <LectureForm
                    course={course}
                    onSubmit={this.props.addLecture}
                />
              }
              oneOf={["ROLE_ADMIN", "ROLE_TEACHER"]}
          />
          <LectureList course={course.id} />
        </div>
      );
    }
    return null;
  }
}

export default connect(
  mapStateToProps,
  {addLecture, fetchCourses}
)(Course);
