import React from 'react';
import './App.css';

const grtthen = "Greater than (>)", 
      lessthan = "Less than (<)",
      equalTo = "Equal To (==)"

export default class ConsoleXVoltPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h1 className="title">XVoltSmashBoom Admin Panel</h1>

                <div>
                    <div className="row">
                        <p className="textStyle">Alert When</p>
                        <select
                            className="inputFiledStyle"
                        //onChange={e => ""}
                        //value={}
                        >
                            <option>Close Price</option>
                            <option>Open Price</option>
                            <option>Last Traded Price</option>
                        </select>
                        <p className="textStyle"> of </p>

                        <div className="stckliststyle">
                            <input className="inputFiledStyle" type="text" placeholder="Search Stocks"/>
                            {/* <ul className="ulstyle">
                                <li className="listyle">dsfsd</li>
                                <li className="listyle">sdfsdf</li>
                                <li className="listyle">fsdf</li>
                                <li className="listyle">sdfsdf</li>
                            </ul> */}
                        </div>

                    </div>
                    <div className="row">
                        <p className="textStyle">is</p>
                        <select
                            className="inputFiledStyle"
                        //onChange={e => ""}
                        //value={}
                        >
                            <option>{grtthen}</option>
                            <option>{lessthan}</option>
                            <option>{equalTo}</option>
                        </select>

                        <p style={{marginLeft:"8px"}} className="textStyle">Trigger Level</p>
                        <input className="textField" type="text" placeholder="Enter Level"/>
                    </div>

                    <input style={{marginLeft:"0", marginTop:"20px"}} className="inputFiledStyle"  type="text" placeholder="Name your trigger"/>
                    <div style={{width:"100%"}}>
                        <p className="btnstyle">Create Trigger</p>
                    </div>
                </div>
            </div>
        )
    }
}