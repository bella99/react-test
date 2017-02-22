import _ from 'lodash';
import React from 'react';
import {Link, browserHistory} from 'react-router';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { ReactDOM,findDOMNode } from 'react-dom';
import GameUtils from './game-utils';

class CreateImageTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFileSecureUrl: '',
            uploadedFile: []
        };
        this.onImageDrop = this.onImageDrop.bind(this);
        this.onOpenClick = this.onOpenClick.bind(this);
        this.deleteImages = this.deleteImages.bind(this);
    }

    componentDidMount() {

    }
    componentWillUnmount() {
    }

    handleImageUpload(file) {
        let upload = request.post('/api/user/upload/image')
            .field('upload_preset', '/api/user/upload/image')
            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.data.images.length >0) {
                this.setState({
                    uploadedFileSecureUrl: response.body.secure_url
                });
            }
        });
    }

    onImageDrop(files) {
        this.setState({
            uploadedFile: this.state.uploadedFile.concat(files)
        });
        this.handleImageUpload(files);
    }
    onOpenClick(){
        console.log(1);
        this.dropzone.open();
    }
    deleteImages(index){
        var len=this.state.uploadedFile.length;
        this.setState({
            uploadedFile:this.state.uploadedFile.splice(0,index).concat(this.state.uploadedFile.splice(index+1,len))
        })
    }
    render() {
        return (
            <div className="upload-images">
                {

                    this.state.uploadedFileSecureUrl === '' ? null : this.state.uploadedFile.map((item,index)=> {
                        return (
                            <div key={item.name} className="uploaded-images">
                                <span className="delete-image theme_highlighted_item" onClick={this.deleteImages.bind(this,index)}>
                                    <span className="glyphicon glyphicon-remove" ></span></span>
                                <img src={item.preview}/>
                            </div>
                        )
                    })
                }
                <Dropzone className="upload-images-block" onDrop={this.onImageDrop} accept="/*"
                          multiple={true} ref={(node) => { this.dropzone = node; }}s>
                    <div className="upload-images-tip">
                        <span className="glyphicon glyphicon-plus"></span>
                        <div>上传图片</div>
                    </div>
                </Dropzone>
            </div>
        )
    }
}
class CreateVideoTopic extends React.Component {
    render() {
        return (
            <div>video</div>
        )
    }
}
class DeleteTips extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    showDeleteTips(){
        $(this.refs.deleteTips).modal('show');
    }
    componentDidMount(){}
    componentWillUnmount(){}
    render(){
        return (
            <div className="delete-tips modal fade in" ref="deleteTips">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="theme_card_background">
                                <span className="pull-right"><span className="glyphicon glyphicon-remove"></span></span>
                                <div>删除视频</div>
                                <div>切换类型后您上传的视频将被删除,确定要切换吗?</div>
                                <div><span className="btn btn-info">确定</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default class GameTopicCreatePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectName: 1,
            selectType: 0,
            topicTitle: '',
            topicDetail: '',
            showImgUpload: false,
            showVideoUpload: false
        };
        this.createTopic = this.createTopic.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeDetail = this.changeDetail.bind(this);
        this.getSelectName = this.getSelectName.bind(this);
        this.getSelectType = this.getSelectType.bind(this);
    }

    componentDidMount() {
        $(this.refs.selectName).selectpicker();
        $(this.refs.selectName).on('hidden.bs.select', function (e) {
            var selectName = parseInt(e.target.value);
            this.setState({
                selectName: selectName
            });
            if (this.getSelectName) {
                this.getSelectName(selectName);
            }
        }.bind(this));



        $(this.refs.selectType).selectpicker();
        $(this.refs.selectType).on('hidden.bs.select', function (e) {
            var selectType = parseInt(e.target.value);
            this.setState({
                selectType: selectType
            });
            if (this.getSelectName) {
                this.getSelectName(selectType);
            }
        }.bind(this));
    }

    componentWillUnmount() {
        $(this.refs.selectName).selectpicker('destory');
    }

    getSelectName(e) {
    }

    getSelectType(e) {
        console.log(1);
        //改变类型时弹出提示框 
        // this.refs.deleteTips.showDeleteTips();
    }

    changeTitle(e) {
        this.setState({topicTitle: _.trim(e.target.value)});
    }

    changeDetail(e) {
        this.setState({topicDetail: _.trim(e.target.value)});
    }

    createTopic() {
        if (!this.state.topicTitle) {
            this.refs.topicTitle.focus();
            return;
        }
        if (!this.state.topicDetail) {
            this.refs.topicDetail.focus();
            return;
        }

        console.log(this.state);
    }

    render() {
        return (
            <div className="game-topic-create-page container theme_card_background">
                <DeleteTips ref="deleteTips"/>
                <div className="create-topic media">
                    <div className="user-img media-left">
                        <img className="img-circle"
                             src="https://testdwimg.ktplay.cn/group1/M00/24/01/wKgBB1cEceOAd8iDAAQHw-zYqkw8832844"
                             alt="ktplay"/>
                    </div>

                    <div className="create-block  media-body theme_secondary_text">
                        <div className="create-detail">
                            <div className="create-title theme_background_line_bottom">创建话题</div>
                            <div className="create-body">
                                <div className="select-title">分类</div>
                                <select className="create-item selectpicker" defaultValue={this.state.selectName}
                                        ref="selectName">
                                    /* {utils.map((item)=>{
                                          return <option value={item}>{item}</option>
                                       })}*/
                                </select>
                                <div className="select-title">类型</div>
                                <select className="create-item selectpicker" defaultValue={this.state.selectType}
                                        onChange={this.getSelectType} ref="selectType">
                                    <option value="0">文本</option>
                                    <option value="1">图片</option>
                                    <option value="2">视频</option>
                                </select>
                                <CreateImageTopic ref="craeteImageTopic"/>
                                <CreateVideoTopic ref="createVideoTopic"/>
                                <div className="select-title">内容</div>
                                <div className="create-emoji create-item">
                                    <div className="emoji theme_main_background"><span
                                        className="glyphicon glyphicon-ice-lolly"></span></div>
                                </div>
                                <div className="create-item input-group">
                                    <input className="form-control" value={this.state.topicTitle}
                                           onChange={this.changeTitle} type="text" ref="topicTitle"
                                           placeholder="标题..."/>
                                </div>
                                <div className="create-item input-group">
                                    <textarea className="form-control" value={this.state.topicDetail}
                                              onChange={this.changeDetail} ref="topicDetail" cols="30" rows="10"
                                              placeholder="内容..."></textarea>
                                </div>
                            </div>
                            <div className="create-foot theme_main_background">
                                <span className="pull-right">
                                    <span className="cancel-btn btn btn-default">取消</span>
                                    <span className="btn btn-info" onClick={this.createTopic}>创建</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};
