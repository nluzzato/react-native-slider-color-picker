import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';
import Immutable from 'immutable';
import tinycolor from 'tinycolor2';
import Slider from 'react-native-smooth-slider';

export class SliderHuePicker extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        const state = {
            color: {
                h: 0,
                s: 1,
                v: 1,
            },
        };
        if (props.oldColor) {
            state.color = tinycolor(props.oldColor).toHsv();
        }
        if (props.defaultColor) {
            state.color = tinycolor(props.defaultColor).toHsv();
        }
        this.state = state;
    }

    shouldComponentUpdate(nextProps, nextState = {}) {
        return !Immutable.is(Immutable.fromJS(this.props), Immutable.fromJS(nextProps))
        || !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.oldColor !== this.props.oldColor) {
            this.setOldColor(nextProps.oldColor);
        }
    }

    static propTypes = {
        color: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                h: PropTypes.number,
                s: PropTypes.number,
                v: PropTypes.number
            }),
        ]),
        defaultColor: PropTypes.string,
        oldColor: PropTypes.string,
        onColorChange: PropTypes.func,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        step: PropTypes.number,
        moveVelocityThreshold: PropTypes.number,    // Prevent onValueChange if slide too faster
        trackImage: Image.propTypes.source,
    };

    static defaultProps = {
        minimumValue: 0,
        maximumValue: 359,  // 360 will cause h to 0 too, so 359 by default
        step: 1,
        moveVelocityThreshold: 2000,
        trackImage: require('./rainbow_slider.png'),
    };

    getColor() {
        const passedColor = typeof this.props.color === 'string' ?
            this.props.color :
            tinycolor(this.props.color).toHexString();
        return passedColor || tinycolor(this.state.color).toHexString();
    }

    setOldColor = oldColor => {
        this.setState({
            color: tinycolor(oldColor).toHsv(),
        });
    }

    _onColorChange(x, resType) {
        let color = {
            ...this.state.color,
            h: x,
        };
        this.setState({
            color,
        });

        if (this.props.onColorChange) {
            this.props.onColorChange(color, resType);
        }
    }

    render() {
        const {
            color,
        } = this.state;
        const {
            style,
            trackStyle,
            trackImage,
            thumbStyle,
            minimumValue,
            maximumValue,
            step,
            moveVelocityThreshold,
        } = this.props;

        let thumbColor = tinycolor({
            h: color.h,
            s: 1,
            v: 1,
        }).toHexString();

        return (
            <View style={styles.container}>
                <Slider
                    style={style}
                    trackStyle={[{backgroundColor: 'transparent'}, trackStyle]}
                    trackImage={trackImage}
                    thumbStyle={[{backgroundColor: thumbColor}, thumbStyle]}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    value={color.h}
                    step={step}
                    moveVelocityThreshold={moveVelocityThreshold}
                    onValueChange={value => this._onColorChange(value)}
                    onSlidingComplete={value => this._onColorChange(value, 'end')}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});
