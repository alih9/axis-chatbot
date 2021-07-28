import '../asset/style.css';
import 'react-chat-widget/lib/styles.css';
import {  useState } from 'react'
const Form = (props) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
 
  const click = (e) => {
    e.preventDefault();
    if (name && email) {
      props.handleSubscribeForm(name, email);
    }
 else {
  alert('name or Email Missing');
}
  }

  return (
  
      
        <div className="wrapper">
    
          <div className="rcw-conversation-container">
            <div className="rcw-header">
              <button className="rcw-close-button">
              </button>
              <h4 className="rcw-title">Subscribe</h4>

            </div>
            <div className="container">
              <form onSubmit={e => e.preventDefault()}>
                <input type="text" id="defaultFormCardNameEx" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="form-control" />
                <br />
                <input type="email" id="defaultFormCardEmailEx" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control " />
          
                <div className="text-center py-4 mt-3" style={{ textAlign: "center", marginBottom: "10px" }}>
                  <button onClick={click} className="btn btn-primary rcw-send"> Send
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTM1LjUgNTM1LjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzNS41IDUzNS41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGcgaWQ9InNlbmQiPgoJCTxwb2x5Z29uIHBvaW50cz0iMCw0OTcuMjUgNTM1LjUsMjY3Ljc1IDAsMzguMjUgMCwyMTYuNzUgMzgyLjUsMjY3Ljc1IDAsMzE4Ljc1ICAgIiBmaWxsPSIjY2JjYmNiIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" style={{ height: "13px", marginLeft: "5px" }} alt="Send"></img>
                  </button>


                </div>
              </form>
            </div>
          </div>
    
        
    
        </div>
);
};

export default Form;