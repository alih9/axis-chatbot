import React from 'react';
import axios from 'axios'
import TrashIcon from '../controls/icons/trash-icon/TrashIcon';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import './ChatTitle.scss';

const ChatTitleArchive =({ selectedConversation, onDeleteConversation, user }) =>{
    let chatTitleContents = null;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const[delBox,setDelBox] =React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };

    const delHandleClickClose=()=>{
    setDelBox(false)
    }

    const handleClickClose = () => {
    setOpen(false);
    };

    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
    setAnchorEl(null);
    };

    const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
    })((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
        }}
        {...props}
    />
    ));

    const StyledMenuItem = withStyles((theme) => ({
        root: {
          '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              color: theme.palette.common.white,
            },
          },
        },
      }))(MenuItem);
          if (selectedConversation) {
              chatTitleContents = (
                  <>
                      <div><span>{selectedConversation.title}</span>
                          
                          
                          <span>
      
                          {/* <div> */}
            {/* <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              onClick={handleClick}
            >
             Settings
            </Button> */}
            {/* <StyledMenu
              id="customized-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
                                      
              <div onClick={handleClickOpen}>
              <StyledMenuItem>
              
                <ListItemIcon>
                  <InboxIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Room Deactivate" onClick={handleClickOpen} />
              </StyledMenuItem>
              </div>
             
              <StyledMenuItem>
                <ListItemIcon>
                  <DraftsIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </StyledMenuItem>
              
              <StyledMenuItem>
                <ListItemIcon>
                  <SendIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </StyledMenuItem>
              
            </StyledMenu> */}
      
            {/* <Dialog
              open={open}
              onClose={handleClickClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              
             {selectedConversation.is_active && <>
           <DialogTitle id="alert-dialog-title">{"Deactivation Room?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Sure, you want to Deactivate the Room?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickClose} >
                  Disagree
                </Button>
                <Button onClick={handleClickDeactivate}  autoFocus>
                  Agree
                </Button>
              </DialogActions> </>}
      
              {!selectedConversation.is_active && <> <DialogTitle id="alert-dialog-title">{"Deactivation Room?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Room is Already Deactive!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickClose} color="primary">
                  OK
                </Button>
               
              </DialogActions> </>}
              
            </Dialog> */}
                                  
          {/* </div> */}
      
                          </span>
                      </div>
                      
                      {/* <div onClick={ () => { setDelBox(true); } } title="Delete Conversation">
                          <TrashIcon /> </div> */}
                          {/* <Dialog
              open={delBox}
              onClose={delHandleClickClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
          
           <DialogTitle id="alert-dialog-title">{"Delete Room?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are Sure you want to Delete the Room?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={delHandleClickClose} color="primary">
                  Cancel
                </Button>            
                <Button onClick={()=>{onDeleteConversation(); delHandleClickClose();  }  } color="warning" autoFocus>
                  Deleted
                </Button>
              </DialogActions> 
              </Dialog> */}
                     
                     
                  </>
              );
          }
      
          return (
              <div id="chat-title">
                  { chatTitleContents }
                  
              </div>
          );

    

}

export default ChatTitleArchive;