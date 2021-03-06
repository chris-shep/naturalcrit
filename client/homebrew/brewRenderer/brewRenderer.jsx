var React = require('react');
var _ = require('lodash');
var cx = require('classnames');

var Markdown = require('marked');
var renderer = new Markdown.Renderer();

//Processes the markdown within an HTML block if it's just a class-wrapper
renderer.html = function (html) {
	if(_.startsWith(html, '<div class=') && _.endsWith(_.trim(html), '</div>')){
		var openTag = html.substring(0, html.indexOf('>')+1);
		html = html.substring(html.indexOf('>')+1);
		html = html.substring(0, html.lastIndexOf('</div>'));
		return `${openTag} ${Markdown(html)} </div>`;
	}
	return html;
}


var PAGE_HEIGHT = 1056 + 30;

var BrewRenderer = React.createClass({
	getDefaultProps: function() {
		return {
			text : ''
		};
	},
	getInitialState: function() {
		return {
			viewablePageNumber: 0,
			height : 0,
			isMounted : false
		};
	},
	totalPages : 0,
	height : 0,

	componentDidMount: function() {
		this.setState({
			height : this.refs.main.parentNode.clientHeight,
			isMounted : true
		});
	},
	handleScroll : function(e){
		this.setState({
			viewablePageNumber : Math.floor(e.target.scrollTop / PAGE_HEIGHT)
		});
	},
	//Implement later
	scrollToPage : function(pageNumber){
	},

	shouldRender : function(pageText, index){
		if(!this.state.isMounted) return false;

		var viewIndex = this.state.viewablePageNumber;
		if(index == viewIndex - 1) return true;
		if(index == viewIndex)     return true;
		if(index == viewIndex + 1) return true;

		//Check for style tages
		if(pageText.indexOf('<style>') !== -1) return true;

		return false;
	},

	renderPageInfo : function(){
		return <div className='pageInfo'>
			{this.state.viewablePageNumber + 1} / {this.totalPages}
		</div>
	},

	renderDummyPage : function(key){
		return <div className='phb' key={key}>
			<i className='fa fa-spinner fa-spin' />
		</div>
	},

	renderPage : function(pageText, index){
		return <div className='phb' dangerouslySetInnerHTML={{__html:Markdown(pageText, {renderer : renderer})}} key={index} />
	},

	renderPages : function(){
		var pages = this.props.text.split('\\page');
		this.totalPages = pages.length;

		return _.map(pages, (page, index)=>{
			if(this.shouldRender(page, index)){
				return this.renderPage(page, index);
			}else{
				return this.renderDummyPage(index);
			}
		});
	},

	render : function(){
		return <div className='brewRenderer'
			onScroll={this.handleScroll}
			ref='main'
			style={{height : this.state.height}}>

			<div className='pages'>
				{this.renderPages()}
			</div>
			{this.renderPageInfo()}
		</div>
	}
});

module.exports = BrewRenderer;
