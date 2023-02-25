import React from 'react';
import Modal from 'react-modal';
import querystring from 'query-string';
import axios from 'axios';
import '../Styles/details.css';    // Importing React to create Component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            restaurantId: undefined,
            menuItemsModalIsOpen: false,
            formsModalIsOpen: false,
            galleryModalIsOpen: false,
            menuitems: [],
            subTotal: 0,
            name: undefined,
            email: undefined,
            contact: undefined,
            address: undefined
        }
    }
    componentDidMount() {
        const qs = querystring.parse(this.props.location.search);
        const { restaurant } = qs;
        axios({
            method: 'GET',
            url: `http://localhost:2963/restraunt/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurant })
            })
            .catch(err => console.log(err));
    }
    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }
    GetMenuItems = () => {
        const { restaurantId } = this.state;
        axios({
            method: 'GET',
            url: `http://localhost:2963/menuitems/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuitems: response.data.menuitems })
            })
            .catch(err => console.log(err));
    }
    addItems = (index, operationType) => {
        let total = 0;
        // Spread Operator - Copy of Reference Types
        const items = [...this.state.menuitems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty++;
        }
        else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }
    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }
    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    //make this call to 4567  http://localhost:2963/payment https://guarded-dusk-22777.herokuapp.com/payment
    getData = (data) => {
        return fetch(`http://localhost:2963/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }
    
    handlePayment = (event) => {

        const { subTotal, email } = this.state;

        if (!email) {
            alert('Please fill this field and then Proceed...');
        }
        else {
            // Payment API Call 
            const paymentObj = {
                amount: subTotal,
                email: email
            };

            this.getData(paymentObj).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        event.preventDefault();
    }
    
    render() {
        const { restaurant, menuItemsModalIsOpen, menuitems, subTotal, formsModalIsOpen, galleryModalIsOpen, email } = this.state;
        return (
            <div className='container-fluid'>
                <div>
                    {/* Showcasing the First Image and rest will be showed in the Carousal  */}
                    <div>
                        <img src={`./${restaurant.image}`} alt="" className="detail_img" />
                        <button className="button button_1" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                    </div>

                </div>
                <div className="heading">{restaurant.name}</div>
                <button className="button_2" onClick={() => {
                    this.handleModal('menuItemsModalIsOpen', true)
                    this.GetMenuItems()
                }}>Place Online Order</button>
                {/* Showing 2 Tabs on screen as Overview and Contact with details in respective sections*/}
                <div className="heading">The Big Chill Cakery</div>
                <div className="tabs">
                    {/* Tab-1 */}
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About the place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377;  {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>
                    {/* Tab-2 */}
                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>
                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">Address</div>
                            <div className="value">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={menuItemsModalIsOpen}
                    style={customStyles}
                >
                    <div className='container2'>
                        <div className="fas fa-times close-btnH" style={{ marginTop: '5px', marginRight: '5px', float: 'right' }} onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button"
                                onClick={() => {
                                    this.handleModal('menuItemsModalIsOpen', false);
                                    this.handleModal('formsModalIsOpen', true);
                                }}> Pay Now</button>
                            {menuitems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-3 col-sm-3 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" alt='' src={`../${item.image}`} style={{
                                                    height: '75px',
                                                    width: '75px',
                                                    borderRadius: '20px',
                                                    marginTop: '12px',
                                                    marginLeft: '3px'
                                                }} />
                                                {item.qty == 0 ? <div>
                                                    <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                </div> :
                                                    <div className="add-number">
                                                        <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                        <span class="qty">{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, 'add')}>+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={formsModalIsOpen}
                    style={customStyles}
                >
                    <div >
                        <div className="fas fa-times close-btnH" style={{ marginTop: '5px', marginRight: '5px', float: 'right' }} onClick={() => this.handleModal('formsModalIsOpen', false)}></div>
                        <form>
                            <label class="form-label">Name</label>
                            <input style={{ width: '370px' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('name', event)} />
                            <label class="form-label">Email</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label class="form-label">Contact Number</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('contact', event)} />
                            <label class="form-label">Address</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('address', event)} />
                            
                            <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.handlePayment}>Proceed</button>
                        </form>
                    </div>
                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}
                >
                    <div className="gallery">
                        <div className="fas fa-times close-btnH" style={{ marginTop: '5px', marginRight: '5px', float: 'right' }} onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                        <Carousel showIndicators={false} showThumbs={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                                return <div>
                                    <img height="350px" width="550px" src={`./${item}`} />
                                </div>
                            })}

                        </Carousel>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Details;  // exporting the component

// makePayment=token=>{
        
//         // amount aur eamil ayenge
//         const{subTotal,email}=this.state;
//         const body={
//             token,
//             subTotal,
//             email,
//           }
//         const headers={
//           "Content-Type":"application/json"
//         }
//         // while deploying make it https
//         return fetch(`http://localhost:2963/payment`,{
//           method:"POST",
//           headers,
//           body:JSON.stringify(body)
//         }).then(response=>{
//           console.log("RESPONSE",response)
//           const{status}=response;
//           console.log("STATUS",status)
//         })
//         .catch(error=>console.log(error));
    
//       }
//new payment function
    // const makePayment = (event) => {
    //     getData({ amount: 500, email: 'abc@gmail.com' }).then(response => {

    //         var information = {
    //             action: "https://securegw-stage.paytm.in/order/process",
    //             params: response
    //         }
    //         post(information)

    //     })
    // }
    // <StripeCheckout
    //                             stripeKey={process.env.REACT_APP_KEY}
    //                             token={this.makePayment}
    //                             name="Buy Your Meal"
    //                             subTotal
    //                             email
    //                         >
    //                             <button >Buy Now in Just {subTotal} ₹</button>
    //                         </StripeCheckout>