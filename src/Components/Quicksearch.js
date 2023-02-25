import React from 'react';

import Quicksearchitem from './Quicksearchitem';
class Quicksearch extends React.Component {
    render() {
        const { mealtypesdata } = this.props;
        return (
            <div>
                <div className="container">
                    <div className="container-fluid">
                        <div className="item-heading">Quick Searches</div>
                        <div className="item-sub-heading">Discover restaurants by type of meal</div>
                        <div className="container-fluid">
                            <div className="row" >
                                {mealtypesdata.map((item) => {
                                    return <Quicksearchitem qsData = {item}/>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Quicksearch;