import React from "react";
import '../Styles/home.css';
import Wallpaper from './wallpaper';
import Quicksearch from "./Quicksearch";

import axios from 'axios';

class Home extends React.Component {
    constructor () {
        super();
        this.state = {
            locations :[],
            mealtypes :[]
        }
    }
    componentDidMount() {
        sessionStorage.clear();
        axios({
            method : 'GET',
            url : 'http://localhost:2963/locations',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({locations : response.data.locations})
        })
        .catch(err=>console.log(err));

        axios({
            method : 'GET',
            url : 'http://localhost:2963/mealtypes',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({mealtypes : response.data.Meals}) 
            // ye jo Meals hai ye mera controllers me jo meal hai woh same hi hona chaiye
        })
        .catch(err=>console.log(err));
    }
    render() {
        const {locations,mealtypes} = this.state;
        return (
            <div>
                <Wallpaper locationsdata={locations}/>
                <Quicksearch mealtypesdata={mealtypes}/>
            </div>
        )
    }
}
export default Home;