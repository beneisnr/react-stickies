import React, { Component } from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';
import TextareaAutosize from 'react-textarea-autosize';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = { isEditing: false };
  }

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  toggleIsEditing = () => {
    this.setState(prevState => ({ isEditing: !prevState.isEditing }));
  };

  handleEdit = (fields) => {
    this.props.onUpdate(this.props.id, fields);
  };

  handleTitleChange = (e) => {
    this.handleEdit({
      title: e.target.value,
      lastEditedBy: this.props.user.displayName,
    });
  };

  handleContentChange = (e) => {
    this.handleEdit({
      content: e.target.value,
      lastEditedBy: this.props.user.displayName,
    });
  };

  handleDrag = (e, ui) => {
    const { x, y } = ui;
    this.handleEdit({ x, y });
  };

  renderTitle = () => {
    const { title } = this.props.note;
    if (this.state.isEditing) {
      return (
        <form>
          <input
            value={title}
            onChange={this.handleTitleChange}
          />
        </form>
      );
    } else {
      return title;
    }
  };

  renderContent = () => {
    const { content } = this.props.note;
    if (this.state.isEditing) {
      return (
        <form>
          <TextareaAutosize
            value={content}
            onChange={this.handleContentChange}
            minRows={6}
            className="text-area"
            wrap="hard"
          />
        </form>
      );
    } else {
      return (
        <div
          className="content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={
            { __html: marked(this.props.note.content || '') }
          }
        />
      );
    }
  };

  render() {
    const { isEditing } = this.state;
    const {
      onStartDrag,
      id,
      user,
      note,
    } = this.props;
    const {
      x, y, zIndex,
    } = note;

    return (
      <Draggable
        handle="header"
        defaultPosition={{ x, y }}
        position={{ x, y }}
        onDrag={this.handleDrag}
        onStart={() => onStartDrag(id)}
        disabled={!user || isEditing}
        bounds={{ top: 0 }}
      >
        <div
          className={user ? 'note' : 'note note-inactive'}
          style={{ zIndex }}
        >
          <header title="Move note">
            <h1>{this.renderTitle()}</h1>
            {user && (
            <div className="note-menu">
              <i
                onClick={this.toggleIsEditing}
                className={isEditing
                  ? 'fas fa-check'
                  : 'fas fa-marker'}
                role="button"
                tabIndex={0}
                title="Edit note"
              />
              <i
                onClick={this.handleDelete}
                className="fas fa-trash"
                role="button"
                tabIndex={0}
                title="Delete note"
              />
            </div>
            )}
          </header>
          <div className="note-content-container">
            {this.renderContent()}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default Note;
