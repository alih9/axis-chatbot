import React from 'react';
import classNames from 'classnames';
import {Modal, Button} from 'react-bootstrap';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import './Message.scss';

const Message = ({ isMyMessage, message, DelMsg }) => {
    const [showModal, setShowModal] = React.useState(false);  
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const onDeleteMessage = ()=>{
        handleClose();
        DelMsg(message,isMyMessage);
    }

    const messageClass = classNames('message-row', {
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    });
    const imageThumbnail = isMyMessage ? null : <img src={message.imageUrl} alt={message.imageAlt} />;
    const messageDropdown = <div className="message-dropdown">
                                <DeleteRoundedIcon className='delete-icon' fontSize='large' onClick={handleShow}/>
                            </div>;
    return (
        
        <div className={messageClass}>
        
            <div className="message-content">
                {imageThumbnail}
                {isMyMessage ? messageDropdown : null}
                <div className="message-text">
                {/* <div className="dropdown"> */}
  {/* <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    
  </button> */}
  {/* <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a className="dropdown-item" href="#">Action</a>
    <a className="dropdown-item" href="#">Another action</a>
    <a className="dropdown-item" href="#">Something else here</a>
  </div> */}
{/* </div> */}
                    {message.messageText}
                </div>
                {!isMyMessage ? messageDropdown : <div></div>}
                <Modal
                    show={showModal}
                    onHide={handleClose}    
                    keyboard={false}
                    centered
                    className='message-delete-modal'
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this message?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{handleClose()}}>Cancel</Button>
                        <Button variant="danger" onClick={()=>{onDeleteMessage()}}>Delete Message</Button>
                    </Modal.Footer>
                </Modal>
                <div className="message-time">{message.createdAt}</div>
            </div>
        </div>
    );
}

export default Message;