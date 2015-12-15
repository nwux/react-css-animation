/**
 * Animation Component for uxcore
 * @author 
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let AnimationCSS = require('../src');
let Button = require('uxcore-button');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [1, 2, 3]
        }
    }

    handleRemove() {
        this.setState({
            list: []
        })
    }

    handleAdd() {
        this.setState({
            list: [1,2,3,4]
        })
    }

    render() {
        return (
            <div>
                <AnimationCSS 
                    name="slide-left"
                    component="div" 
                    appear={true} 
                    appearTimeout={2000} 
                    enterTimeout={500}
                    leaveTimeout={500}
                    callback={{
                        willAppear: function(child) {
                            console.log(new Date().getTime(), "willAppear", child);
                        },
                        willEnter: function(child) {
                            console.log(new Date().getTime(), "willEnter", child);
                        },
                        willLeave: function(child) {
                            console.log(new Date().getTime(), "willLeave", child);
                        },
                        didAppear: function(child) {
                            console.log(new Date().getTime(), "didAppear", child);
                        },
                        didEnter: function(child) {
                            console.log(new Date().getTime(), "didEnter", child);
                        },
                        didLeave: function(child) {
                            console.log(new Date().getTime(), "didLeave", child);
                        }
                    }}>
                    {this.state.list.map((item) => {
                        return <Button key={item} size="large">{"测试" + item}</Button>
                    })}

                </AnimationCSS>
                <Button className="remove-button" onClick={this.handleAdd.bind(this)}>增加动画</Button>
                <Button className="remove-button" onClick={this.handleRemove.bind(this)} type="secondary">移除动画</Button>
            </div>
        );
    }
}

module.exports = Demo;