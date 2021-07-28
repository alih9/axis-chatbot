
import 'react-chat-widget/lib/styles.css';
import { Widget, addResponseMessage } from 'react-chat-widget';
import { useEffect  } from 'react';


export default function ChatWidget() {


    useEffect(() => {
        addResponseMessage("Welcome to this awesome chat!")
    },[])
        
    
     const  handleNewUserMessage = (newMessage) => {
        console.log(`New message incomig! ${newMessage}`);
        // Now send the message throught the backend API
      }
    

    return (
      <>

<div >
        <Widget
          handleNewUserMessage={handleNewUserMessage}
      
          title="My new awesome title"
          subtitle="And my cool subtitle"
        />
      </div>


</>
  );
}