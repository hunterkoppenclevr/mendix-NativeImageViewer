import { Component, createElement } from "react";
import { Dimensions, Modal, PixelRatio } from "react-native";
import { Image } from "mendix/components/native/Image";
import ImageZoom from "react-native-image-pan-zoom";

export class NativeImageViewer extends Component {
    state = {
        imageVisible: true,
        windowWidth: Dimensions.get("window").width,
        windowHeight: Dimensions.get("window").height
    };
    render() {
        const { imageToView, imageWidthAttr, imageHeightAttr, showModal } = this.props;
        if (!imageToView || imageToView.status !== "available" || !imageToView.value.uri) {
            return null;
        }

        let imageWidth = Number(imageWidthAttr.value);
        let imageHeight = Number(imageHeightAttr.value);
        const imageStyle = [{ width: imageWidth, height: imageHeight }];
        const imageZoom = (
            <ImageZoom
                cropWidth={imageWidth}
                cropHeight={imageHeight}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                enableCenterFocus={false}
                minScale={1}
                onClick={() => this.onClick()}
            >
                {this.renderImage(imageStyle)}
            </ImageZoom>
        );
        if (showModal) {
            return (
                <Modal visible={this.state.imageVisible} transparent={true}>
                    {imageZoom}
                </Modal>
            );
        } else {
            return imageZoom;
        }
    }

    renderImage(imageStyle) {
        if (this.state.imageVisible) {
            // console.info("NativeImageViewer render image");
            return <Image source={this.props.imageToView.value} style={imageStyle} />;
        } else {
            // console.info("NativeImageViewer skip render image because modal is not shown");
            return null;
        }
    }

    handler = newDimensions => {
        // console.info(
        //     "NativeImageViewer dimension change handler, new width: " +
        //         newDimensions.window.width +
        //         ", height: " +
        //         newDimensions.window.height
        // );
        this.setState({
            windowHeight: newDimensions.window.height,
            windowWidth: newDimensions.window.width
        });
    };

    onClick() {
        // console.info("NativeImageViewer close button clicked");
        this.setState({
            modalVisible: false
        });
        const { onCloseAction } = this.props;
        if (onCloseAction && onCloseAction.canExecute && !onCloseAction.isExecuting) {
            onCloseAction.execute();
        }
    }

    componentDidMount() {
        Dimensions.addEventListener("change", this.handler);
    }

    componentWillUnmount() {
        // Important to stop updating state after unmount
        Dimensions.removeEventListener("change", this.handler);
    }
}
