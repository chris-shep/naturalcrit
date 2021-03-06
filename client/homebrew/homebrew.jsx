var React = require('react');
var _ = require('lodash');
var cx = require('classnames');

var CreateRouter = require('pico-router').createRouter;

var HomePage = require('./pages/homePage/homePage.jsx');
var EditPage = require('./pages/editPage/editPage.jsx');
var SharePage = require('./pages/sharePage/sharePage.jsx');
var NewPage = require('./pages/newPage/newPage.jsx');

var Router;
var Homebrew = React.createClass({
	getDefaultProps: function() {
		return {
			url : "",
			welcomeText : "",
			changelog : "",
			brew : {
				title : '',
				text : '',
				shareId : null,
				editId : null,
				createdAt : null,
				updatedAt : null,
			}
		};
	},
	componentWillMount: function() {
		Router = CreateRouter({
			'/homebrew/edit/:id' : (args) => {
				return <EditPage id={args.id} brew={this.props.brew} />
			},

			'/homebrew/share/:id' : (args) => {
				return <SharePage id={args.id} brew={this.props.brew} />
			},
			'/homebrew/changelog' : (args) => {
				return <SharePage brew={{title : 'Changelog', text : this.props.changelog}} />
			},
			'/homebrew/new' : (args) => {
				return <NewPage />
			},
			'/homebrew*' : <HomePage welcomeText={this.props.welcomeText} />,
		});
	},
	render : function(){
		return(
			<div className='homebrew'>
				<Router initialUrl={this.props.url}/>
			</div>
		);
	}
});

module.exports = Homebrew;
