import React from "react";
import '../Styles/filter.css';
import querystring from 'query-string';
import axios from "axios";

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restraunts: [],
            locations: [],
            pageCount: [],
            mealtype: undefined,
            cuisine: [],
            location: undefined,
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: 1

        }
    }

    componentDidMount() {
        const qs = querystring.parse(this.props.location.search);
        const { mealtype, location } = qs;

        const filterobj = {
            mealtype: Number(mealtype),
            location//quetion mark ke bad jo bhi ke ka naam hai woh ham yha denge
        }
        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterobj
        }).then(response => {
            this.setState({ restraunts: response.data.restraunts, mealtype, location, pageCount: response.data.pageCount })//mealtype:mealtype
            // ye jo Meals hai ye mera controllers me jo meal hai woh same hi hona chaiye
        })
            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: 'https://tomato-api-x20u.onrender.com/locations',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ locations: response.data.locations })
        })
            .catch(err => console.log(err));
    }
    // location handler
    handleLocationChange = (event) => {
        const location = event.target.value;
        const { mealtype, cuisine, sort, lcost, hcost, page } = this.state;
        const filterobj = {
            mealtype: Number(mealtype),
            sort,
            cuisine :cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            location,
            page
        }
        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterobj
        }).then(response => {
            this.setState({ restraunts: response.data.restraunts, location, pageCount: response.data.pageCount })
        })
            .catch(err => console.log(err));
        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}`);
    }
    // cost handler
    handleCostChange = (lcost, hcost) => {
        const { mealtype, cuisine, sort, location, page } = this.state;
        const filterobj = {
            mealtype: Number(mealtype),
            sort,
            cuisine,
            lcost,
            hcost,
            location,
            page
        }
        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterobj
        }).then(response => {
            this.setState({ restraunts: response.data.restraunts, lcost, hcost, pageCount: response.data.pageCount })
        })
            .catch(err => console.log(err));
    }
    // sort handler
    handleSortChange = (sort) => {
        const { mealtype, cuisine, lcost, hcost, location, page } = this.state;
        const filterobj = {
            mealtype: Number(mealtype),
            sort,
            cuisine,
            lcost,
            hcost,
            location,
            page
        }
        // https://agile-sea-01844.herokuapp.com
        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterobj
        }).then(response => {
            this.setState({ restraunts: response.data.restraunts, sort, pageCount: response.data.pageCount })
        })
            .catch(err => console.log(err));
    }

    handleCuisine = (cuisineId) => {
        const { mealtype, cuisine, location, lcost, hcost, sort, page } = this.state;

        const index = cuisine.indexOf(cuisineId);

        if (index >= 0) {
            cuisine.splice(index, 1);
        } else {
            cuisine.push(cuisineId);
        }

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            location,
            lcost,
            hcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restraunts: response.data.restraunts, cuisine, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }
    handlePageChange = (page) => {

        const { mealtype, cuisine, location, lcost, hcost, sort } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            location,
            lcost,
            hcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'https://tomato-api-x20u.onrender.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restraunts: response.data.restraunts, page, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }
    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }
    render() {
        const { restraunts, locations, pageCount } = this.state;
        return (
            <div>
                
                <div className="breakfast">Breakfast Places in Mumbai</div>
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-4 col-md-12 col-sm-12">

                            <div className="filter">
                                <span className="filter-heading">Filters</span>
                                <div className="icon-1"><span className="fas fa-angle-double-down " data-bs-toggle="collapse"
                                    data-bs-target="#collapseExample"></span>
                                </div>
                                <div data-bs-toggle="collapse show" id="collapseExample">
                                    <div className="select-location">Select Location</div>
                                    <select className="select-dd" onChange={this.handleLocationChange}>
                                        <option value={0}>select</option>
                                        {locations.map((item) => {
                                            return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                        })}
                                    </select>
                                    <div className="Cuisine">Cuisine</div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisine(1)} />
                                        <span className="checkbox-items">North Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisine(2)} />
                                        <span className="checkbox-items" >South Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisine(3)} />
                                        <span className="checkbox-items" >Chineese</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisine(4)} />
                                        <span className="checkbox-items" >Fast Food</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisine(5)} />
                                        <span className="checkbox-items" >Street Food</span>
                                    </div>
                                    <div className="Cuisine">Cost For Two</div>
                                    <div>
                                        <input type="radio" name="price" onChange={() => this.handleCostChange(1, 500)} />
                                        <span className="checkbox-items">Less than &#8377; 500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="price" onChange={() => this.handleCostChange(500, 1000)} />
                                        <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="price" onChange={() => this.handleCostChange(1000, 1500)} />
                                        <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="price" onChange={() => this.handleCostChange(1500, 2000)} />
                                        <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="price" onChange={() => this.handleCostChange(2000, 50000)} />
                                        <span className="checkbox-items">&#8377; 2000 +</span>
                                    </div>
                                    <div className="Cuisine">Sort</div>
                                    <div>
                                        <input type="radio" name="range" onChange={() => this.handleSortChange(1)} />
                                        <span className="checkbox-items">Price low to high</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="range" onChange={() => this.handleSortChange(-1)} />
                                        <span className="checkbox-items">Price high to low</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            {restraunts.length > 0 ? restraunts.map(item => {
                                return <div className="item1 box_2" onClick={() => this.handleNavigate(item._id)}>
                                    <div className="row margin">
                                        <div className="col-3 ">
                                            <img src={`${item.image}`} alt="" height="115px" width="115px" className="img" />
                                        </div>
                                        <div className="col-9">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.locality}</div>
                                            <div className="rest-address">{item.city}</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row padding-left">
                                        <div className="Bakery">CUISINES : {item.cuisine.map(cuisine => `${cuisine.name},`)}</div>
                                        <div className="Bakery">COST FOR TWO :&#8377; {item.min_price} </div>
                                    </div>
                                </div>
                             }) : <div className="no-records">
                                No Records Found...
                            </div>}
                            {restraunts.length > 0 ?
                                <div className="pagination">
                                    <span className="page-num">&laquo;</span>
                                    {pageCount.map(pageNo => {
                                        return <span className="page-num" onClick={() => this.handlePageChange(pageNo)}>{pageNo}</span>
                                    })}
                                    < span className="page-num" >&raquo;</span>
                                </div> : null}
                            <div className="container" style={{ textAlign: 'center' }}>

                                {/* <a href="#" className="paginationa">&laquo;</a>
                                <a href="#" className="paginationa">1</a>
                                <a href="#" className="paginationa">2</a>
                                <a href="#" className="paginationa">3</a>
                                <a href="#" className="paginationa">4</a>
                                <a href="#" className="paginationa">5</a>
                                <a href="#" className="paginationa">6</a>
                                <a href="#" className="paginationa">7</a>
                                <a href="#" className="paginationa">&raquo;</a> */}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;