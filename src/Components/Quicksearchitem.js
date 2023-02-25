import React from "react";
import { withRouter } from "react-router-dom";
class Quicksearchitem extends React.Component {
    handlenavigate = (mealTypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if(locationId){
            this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`);
        }
        else{
        this.props.history.push(`/filter?mealtype=${mealTypeId}`);}
    }
    render() {
        const {qsData} = this.props;
        return (
                <div className="col-lg-4 col-md-12 col-sm-12" onClick={()=>this.handlenavigate(qsData.meal_type)}>
                    <div className="item animate">
                        <div className="row">
                            <div className="col-6">
                                <img src={`${qsData.image}`} class="border_quicksearch" alt=""height="160" width="100%" />
                            </div>
                            <div className="col-6 pd">
                                <div className="item-heading">
                                    {qsData.name}
                                </div>
                                <div className="item-sub-heading">
                                    {qsData.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
export default withRouter(Quicksearchitem);