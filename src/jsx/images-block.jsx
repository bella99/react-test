import React from 'react';
import Lightbox from 'react-images';

import BaseUtils from './base-utils';

export class ImagesBlock extends React.Component {

    static transImages(images) {
        return images.map((row) => {
            return {
                src: row.url,
                thumbnail: row.url,
                caption: '',
                orientation:'square',
                useForDemo:'true'
            };
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            currentImage: 0,
            lightboxIsOpen: false,
            lightboxImages: ImagesBlock.transImages(props.images || []),
            showThumbnails: false
        };

        this.openLightbox = this.openLightbox.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
        this.handleClickImage = this.handleClickImage.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
            lightboxImages: ImagesBlock.transImages(props.images || []),
            showThumbnails: false
        });
    }

    componentDidMount() {
        $(this.refs.Gallery).justifiedGallery({
            rowHeight : 320
        });
    }

    openLightbox(index, event) {
        event.preventDefault();
        this.setState({
            currentImage: index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    gotoImage(index) {
        this.setState({
            currentImage: index,
        });
    }

    handleClickImage() {
        if (this.state.currentImage !== this.state.lightboxImages.length - 1)
            this.gotoNext();
    }

    render() {
        return (
            <div className="images-block">
                <div ref="Gallery" className="gallery">
                    {
                        this.state.lightboxImages.map((row, index) => {
                            return <img key={index} className="image" src={row.src} onClick={(e) => this.openLightbox(index, e)}/>
                        })
                    }
                </div>
                <Lightbox
                    currentImage={this.state.currentImage}
                    isOpen={this.state.lightboxIsOpen}
                    images={this.state.lightboxImages}
                    showThumbnails={this.state.showThumbnails}
                    onClickImage={this.handleClickImage}
                    onClickNext={this.gotoNext}
                    onClickPrev={this.gotoPrevious}
                    onClickThumbnail={this.gotoImage}
                    onClose={this.closeLightbox}
                />
            </div>
        );
    }
}

export class ListImagesBlock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: props.total || 0,
            images: props.images || [],
            vertical: props.direction === "vertical",

        }
        this.onClick = props.onClick;
        this.onClickMore = props.onClickMore;
    }

    componentWillReceiveProps(props) {
        this.setState({
            total: props.total || 0,
            images: props.images || [],
            vertical: props.direction === "vertical"
        });
    }

    handleClick(index, id) {
        if(this.onClick)
            this.onClick(index, id);
    }

    handleClickMore() {
        if(this.onClickMore)
            this.onClickMore();
    }

    render() {
        var image_count = this.state.images.length;
        if (image_count < 1)
            return <div></div>;

        var layout_count = this.state.vertical? 4: 3;

        var more = (this.state.total || image_count) - layout_count;
        var images = this.state.images.slice(0, layout_count);
        if(image_count >= 2 && image_count < layout_count)
            images.push({url: '', id: 0});

        if(image_count == 1){
            return(
                <section className={"list-images-block" + (this.state.vertical? "-vertical": "")}>
                    {
                        images.map((img, index) => {
                            return (
                                <div key={img.url} className="flex-img">
                                    <img src={img.url} alt={img.url} onClick={this.handleClick.bind(this, index, img.id)} />
                                </div>
                            )
                        })
                    }
                </section>
            )
        } else if(image_count == 2){
            return (
                <section className={"list-images-block" + (this.state.vertical? "-vertical": "")}>
                    {
                        images.map((img, index) => {
                            return (
                                <div key={img.url} className="flex-img two-images">
                                    <img src={img.url} alt={img.url} onClick={this.handleClick.bind(this, index, img.id)} />
                                </div>

                            );
                            index += index;
                        })
                    }
                </section>
            )
        }else if(image_count > 2){
            var moreNumber = <div></div>;
            if(more > 0)
                moreNumber =  <div className="list-images-block-num" onClick={this.handleClickMore.bind(this)}><span className="num">+{BaseUtils.prettifyNumber(more, {s: 1})}</span></div>;
            return (
                <section className={"list-images-block" + (this.state.vertical? "-vertical": "")}>
                    {
                        images.map((img, index) => {
                            return (
                                <div key={img.url} className="flex-img more-images" >
                                    <img src={img.url} alt={img.url} onClick={this.handleClick.bind(this, index, img.id)}/>
                                    {moreNumber}
                                </div>
                            )
                        })
                    }
                </section>
            )
        }
    };
}

export class ListImagesBlockLight extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentImage: 0,
            lightboxIsOpen: false,
            lightboxImages: ImagesBlock.transImages(props.images || []),
            showThumbnails: false,
            images: props.images || [],
            vertical: props.direction === "vertical",
        };

        this.openLightbox = this.openLightbox.bind(this);
        this.openLightboxAt = this.openLightboxAt.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
        this.handleClickImage = this.handleClickImage.bind(this);
    }

    openLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: true,
        });
    }

    openLightboxAt(index) {
        this.setState({
            currentImage: index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    gotoImage(index) {
        this.setState({
            currentImage: index,
        });
    }

    handleClickImage() {
        if (this.state.currentImage !== this.state.images.length - 1)
            this.gotoNext();
    }

    render() {
        if(this.state.images.length < 1)
            return <div />;

        return (
            <div className="list-images-block-light">
                <ListImagesBlock
                    images={this.state.images}
                    direction={this.state.direction}
                    onClick={this.openLightboxAt}
                    onClickMore={this.openLightbox}
                />
                <Lightbox
                    currentImage={this.state.currentImage}
                    isOpen={this.state.lightboxIsOpen}
                    images={this.state.lightboxImages}
                    showThumbnails={this.state.showThumbnails}
                    onClickImage={this.handleClickImage}
                    onClickNext={this.gotoNext}
                    onClickPrev={this.gotoPrevious}
                    onClickThumbnail={this.gotoImage}
                    onClose={this.closeLightbox}
                />
            </div>
        );
    }
}
