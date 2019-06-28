import React, { Component } from 'react';
import './AttemptList.css';
import Table from 'react-bootstrap/Table';

export default class AttemptList extends Component {
    constructor(props) {
        super(props);

        this.messagesEndRef = React.createRef(); // ref to placeholder div for scrolling to view
        this.renderRowData = this.renderRowData.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    renderRowData(attemptData) {
        let highlight = attemptData.highlight;
        let highlightAll = false;
        if (highlight === void 0) {  // check if hightlight prop is present
            highlight = []; 
            highlightAll = true 
        }
        let answer = attemptData.answer.split(''); // convert to array
        return answer.map((chr, idx) => {
            let isHighlighted = highlight.indexOf(chr) >= 0; // flag to identify highlighted character
            if (isHighlighted){
                highlight = highlight.filter((value, index) => value !== chr); // filter and keep remaining characters yet to be highlighted
            }
            return <td key={attemptData.answer + "-" + idx} className='attempt-char'>
                <div className={(isHighlighted || highlightAll) ? 'highlight' : ''}>
                    {chr}
                </div>
            </td>
        });
    }
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView(false);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        return (
            <div className='table-scroll'>
                {this.props.attempts.map((attemptData, idx) => {
                    return (
                        <Table key={attemptData.answer + "-" + idx} className='table table-borderless attempt-table'>
                            <tbody>
                                <tr className='attempt-item'>{this.renderRowData(attemptData)}</tr>
                            </tbody>
                        </Table>);
                })}
                <div ref={this.messagesEndRef} />
            </div>
        );
    }
}