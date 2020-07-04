import React from 'react';
import Papa from 'papaparse';
import './App.css';

const grtthen = "Greater than (>)", 
      lessthan = "Less than (<)",
      equalTo = "Equal To (==)"

export default class ConsoleXVoltPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showStockList : false,
            alertWhen : "Close Price",
            greaterOrLess : grtthen,
            selectedStock : "",
            triggerLevel : "",
            triggerName : "",
            stocksList : [],
            filteredStocks : [],
            triggerList : [],
            data : [],
        }

        this.myRef = React.createRef();
        this.getData = this.getData.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentWillMount() {
        this.getCsvData();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside,false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside,false);
    }

    handleClickOutside(event) {

        if (this.myRef && !this.myRef.current.contains(event.target)) {
            this.setState({showStockList:false});
        }
    }

    render() {
        return (
            <div>
                <div className="contentblock">
                    <h1 className="title">XVoltSmashBoom Admin Panel</h1>

                    <div>
                        <div className="row">
                            <p className="textStyle">Alert When</p>
                            <select
                                className="inputFiledStyle"
                                value={this.state.alertWhen}
								onChange={e => this.setOhlc(e)}
                            >
                                <option>Close Price</option>
                                <option>Open Price</option>
                                <option>Last Traded Price</option>
                            </select>
                            <p className="textStyle"> of </p>

                            <div ref={this.myRef} className="stckliststyle">
                                <input className="inputFiledStyle" 
                                    type="text" 
                                    placeholder="Search Stocks" 
                                    onClick={()=>{this.setState({showStockList:true})}} 
                                    value = {this.state.selectedStock}
                                    onChange={e => this.filterStocks(e)}/>


                                {this.state.showStockList && <ul className="ulstyle">
                                    {this.state.filteredStocks.map((arr,i) =>{
                                        if(this.state.selectedStock===""){
                                            if(i!==0){
                                                return <li onClick={()=>{this.setStock(arr[0])}} className="listyle"><span>{arr[0]}</span><span style={{fontSize:"14px"}}>{arr[1]}</span></li>
                                            }else{
                                                return null
                                            }
                                                
                                        }else{
                                            return <li onClick={()=>{this.setStock(arr[0])}} className="listyle"><span>{arr[0]}</span><span style={{fontSize:"14px"}}>{arr[1]}</span></li>
                                        }
                                        
                                    })}
                                </ul>}
                            </div>

                        </div>
                        <div className="row">
                            <p className="textStyle">is</p>
                            <select
                                className="inputFiledStyle"
                                onChange={e => {this.setGreateOrLess(e)}}
                                value={this.state.greaterOrLess}
                            >
                                <option>{grtthen}</option>
                                <option>{lessthan}</option>
                                <option>{equalTo}</option>
                            </select>

                            <p style={{ marginLeft: "8px" }} className="textStyle">Trigger Level</p>
                            <input className="textField" type="text" placeholder="Enter Level" onChange={(e)=>{this.setTrigLvl(e)}}/>
                        </div>

                        <input style={{ marginLeft: "0", marginTop: "16px" }} 
                        className="inputFiledStyle" type="text" 
                        placeholder="Name your trigger" 
                        onChange={(e)=>{this.setTiggerName(e)}}/>

                        <div style={{ width: "100%" }} onClick={()=>{this.createTrigger()}}>
                            <p className="btnstyle">Create Trigger</p>
                        </div>
                    </div>
                </div>

                <div className="listBlock">
                    <h1 style={{ left: "0" }} className="title">Triggers List</h1>
                    <div style={{backgroundColor:"lightgray"}} className="triggerliststyle">
                        <p className="listitemFirst">Name</p>
                        <p className="listitem">Condition</p>
                        <p className="listitem">Level</p>
                        <p className="listitem">Status</p>
                    </div>
                    <div>
                        {this.state.triggerList.map(stock =>{
                            return <div className="triggerliststyle">
                                <div className="horizontal">
                                    <p className="listitemFirstrow">{stock.trigName}</p>
                                    <img className="moreicon" alt="" src="more.svg" />
                                </div>
                                <p className="listitemrow">{stock.trigGrtOrLess}</p>
                                <p className="listitemrow">{stock.trigLvl}</p>
                                <p className="listitemrow">Active</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        )
    }

    createTrigger = () =>{
        if(this.state.selectedStock ===""){
            alert("Please Select Stock");
        }else if(this.state.triggerLevel ===""){
            alert("Please enter Trigger Level")
        }else{
            let triggerObj = {
                trigName : this.state.selectedStock,
                trigLvl : this.state.triggerLevel,
                trigGrtOrLess : this.state.greaterOrLess,
                alertWhen : this.state.alertWhen,
            }
            let arr = this.state.triggerList;
            arr.splice(0,0,triggerObj);

            this.setState({triggerList : arr});
        }

        console.log(this.state.triggerList);
    }

    setTiggerName = (e)=>{
        this.setState({triggerName : e.target.value});
    }

    setTrigLvl = (e) =>{
        this.setState({triggerLevel : e.target.value});
    }

    setOhlc = (e) =>{
        this.setState({alertWhen : e.target.value});
    }

    setGreateOrLess = (e) =>{
        this.setState({ greaterOrLess: e.target.value});
    }

    setStock =(stckName) =>{
        this.setState({selectedStock:stckName , showStockList:false});
    }

    filterStocks = (e) =>{
        let stocskArr = this.state.data.filter(function(arr){
            if((arr[0] && arr[0].toLowerCase().includes(e.target.value.toLowerCase())) || (arr[1] && arr[1].toLowerCase().includes(e.target.value.toLowerCase())) ){
                return true
            }else{
                return false
            }
        } );
        this.setState({filteredStocks : stocskArr, selectedStock : e.target.value});
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            complete: this.getData
        });
    }

    fetchCsv() {
        return fetch('/stocks/StocksList.csv').then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    getData(result) {
        this.setState({data: result.data});
        this.setState({filteredStocks : result.data});
        //console.log("Result", result);
    }
}