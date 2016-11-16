import React from 'react';
import ReactDOM from 'react-dom';


	//获取当前时间
	function getDate()
	{
		var d=new Date(),
			year=d.getFullYear(),
			month=d.getMonth()+1,
			day=d.getDate(),
			now=year+"-"+month+"-"+day;
			
		return now;
	}		

//创建单个博客组件
var BlogItem = React.createClass({

	render: function() {
	        var left = "left", 
				right = "right",  
				href="index_content.html?key="+this.props.index;//跳转url
				
    return (
	<div className="col-md-12">
		<div className="tc-ch">
			<div className="tc-font">
				<a>{this.props.data.title}</a>
			</div>
			<div className="tc-time">Time&nbsp;
				<a>{this.props.data.time} </a>
			</div>
			<div className="tc-content">
				<a>{this.props.data.content2}</a>
			</div>
			<div className="tc-function">
				<div className="bht1" style={{float:left}}>
					<a href={href}>查看全文{this.props.key}</a>
				</div>
				<div className="nav" style={{float:right}}>
					<a href="javascript:;" onClick={this.props.delBlog}>删除</a>&nbsp;

					<a href="javascript:;" data-toggle="modal" onClick={this.props.editBlog} data-target="#myEditModal">修改</a>
				</div>
			</div>
		</div>
	</div>
	);
  }
});


var MainContent = React.createClass({
	//在渲染前给State赋值
	componentWillMount :function()
	{
		//判断localStorage中是否存在 博客文章
		 if(window.localStorage.getItem("blogs")){
		 
			var blogs=JSON.parse(window.localStorage.getItem("blogs")); 
			this.setState({blogsData:blogs});	
			}else{
		   
			this.setState({blogsData:[]});	
		 }
		
	},
	getInitialState: function () 
	{
		//定义初始状态
		return {
			blogsData:[]
		};
	},
	 
	EditBlog:function(index){
		return function () {
			var BlogsData=this.state.blogsData;
			//获取当前localStorage里的博客内容
			//var blogsF=JSON.parse(window.localStorage.getItem("blogs")); 
			//赋值给修改表单
			$(this.refs.EditTitle).val(BlogsData[index]['title']);
			$(this.refs.EditContent).val(BlogsData[index]['content']);
			$(this.refs.EditKey).val(index);
			
		}.bind(this);	
	},
	//提交修改表单内容
	myEditPut:function(){
			
			var index=$(this.refs.EditKey).val(),
				title=$(this.refs.EditTitle).val(),
				content=$(this.refs.EditContent).val(),
				now=getDate(),
				BlogsData=this.state.blogsData,
				blog={'title':title,'content':content,'time':now};
			
			BlogsData[index]=blog;
			window.localStorage.setItem("blogs",JSON.stringify(BlogsData)); 
			this.setState({blogsData:BlogsData});	
			$('#myEditModal').modal('hide');	
		
	},
	//添加博客
	myAddPut:function(){

			var title=$(this.refs.AddTitle).val(),
				content=$(this.refs.AddContent).val(),
				now=getDate(),
				BlogsData=this.state.blogsData,
				//blogsF=JSON.parse(window.localStorage.getItem("blogs")), //获取当前localStorage里的博客内容
				NewBlog={'title':title,'content':content,'time':now};
					
			var i=BlogsData.push(NewBlog); 
			window.localStorage.setItem("blogs",JSON.stringify(BlogsData));
			this.setState({blogsData:BlogsData});			
			$('#myAddModal').modal('hide');	
	},
	//删除博客
	deleteBlog:function(index){
		 return function () {
			if(confirm("是否删除该文章？")){
				//获取当前localStorage里的博客内容
					//var blogsF=JSON.parse(window.localStorage.getItem("blogs")); 
				var BlogsData=this.state.blogsData;
					BlogsData.splice(index,1);
					var json_blog=JSON.stringify(BlogsData);
					
					window.localStorage.setItem("blogs",json_blog); 
					var blogData=JSON.parse(json_blog);		
					
					this.setState({blogsData:blogData});	
			}
		}.bind(this);
			
		
	},
	render: function() {
		var BlogItems=[];
		var BlogsData=this.state.blogsData;

		//遍历博客
		BlogsData.map(function(value,index){
			if(value.content.length>200){
				value.content2=value.content.substr(0,200)+"...";
			}
			//给博客赋值属性
			BlogItems.push(<BlogItem data={value} index={index} delBlog={this.deleteBlog(index)} editBlog={this.EditBlog(index)} />);
			
		}.bind(this));
		return (
		<div>
			<div className="container">
					<div className="col-md-12 text-center">My Blog</div>
					<div className="col-md-12 text-add">
						<a href="javascript:;" data-toggle="modal" data-target="#myAddModal">增加</a>
					</div>
					<div id="blogDiv">    
							{BlogItems}
					</div>
			</div>
			<div className="modal fade" id="myAddModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">增加文章</h4>
						</div>
						<form id="myAddForm" name="myAddForm">
						   <div className="modal-body">
								<div className="form-group">
									<label htmlFor="title" className="control-label"  >标题：</label>
									<input type="text" className="form-control" ref="AddTitle" name="title" />
								</div>
								 <div className="form-group">
									<label htmlFor="content" className="control-label">正文：</label>
								  <textarea name="content" className="form-control" ref="AddContent" rows="15"></textarea>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
								<button type="button" className="btn btn-primary" onClick={this.myAddPut}>提交</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="modal fade" id="myEditModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title" id="myModalLabel">修改文章</h4>
						</div>
						<form id="myEditForm">
							<div className="modal-body">
								<input type="hidden" name="key" ref="EditKey" value=""/>
								<div className="form-group">
									<label htmlFor="title" className="control-label">标题：</label>
									<input type="text" className="form-control" ref="EditTitle" name="title" />
								</div>
								 <div className="form-group">
									<label htmlFor="content" className="control-label">正文：</label>
								  <textarea name="content" className="form-control" ref="EditContent" rows="15"></textarea>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
								<button type="button" className="btn btn-primary" onClick={this.myEditPut}>提交</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>	
		);
		
	}
});

 ReactDOM.render(
	<MainContent />,
    document.getElementById('main')
 );
 
 
 
 
 
