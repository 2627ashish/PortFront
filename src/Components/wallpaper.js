import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
class wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restraunts: [],
            suggesstions: [],
            inputText: undefined
        }
    }
    handleDDchange = (event) => {
        const locationid = event.target.value;
        sessionStorage.setItem('locationId', locationid);//where locationId is the variable name and locationid is the vlaue
        axios({
            method: 'GET',
            url: `https://tomato-api-x20u.onrender.com/${locationid}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ restraunts: response.data.Restraunts })
        })
            .catch(err => console.log(err));
    }
    handleSearch = (event) => {
        const inputText = event.target.value;
        const { restraunts } = this.state;
        const suggesstions = restraunts.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({ suggesstions, inputText });
    }
    selectingRestaurant = (resObj) => {
        this.props.history.push(`/details?restaurant=${resObj._id}`);
    }
    showSuggestions = () => {
        const { suggesstions, inputText } = this.state;
        if (suggesstions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggesstions.length > 0 && inputText == '') {
            return null;
        }
        if (suggesstions.length == 0 && inputText) {
            return <ul>
                <li>No Search Result Found</li>
            </ul>
        }
        return (
            <ul >
                {
                    suggesstions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
                }
            </ul>
        );
    }
    render() {
        const { locationsdata } = this.props;
        return (
            <div>
                <img src="./Assets/homepageimg.png" alt="" width="100%" height="400px" />

                <div className="texto">
                    <div className="image-top">
                        <div className="logo">
                            <b>Tomato</b>
                        </div>
                        <div className="wallpaper-heading">Find the best restaurants, cafes, bars</div>
                        <div className="ll">
                            <select className="locationDropdown" onChange={this.handleDDchange}>
                                <option value="0" >Select</option>
                                {locationsdata.map(item => {
                                    return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                })}
                            </select>
                            {/* <span className="glyphicon glyphicon-search search"></span> */}
                            <div id="notebooks">
                                <input id="query" className="restaurantsinput" type="text"
                                    placeholder="Please Enter Restaurant Name" onChange={this.handleSearch} />
                                {this.showSuggestions()}
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(wallpaper);