import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
} from 'react-native';
import Immutable from 'immutable';
import tinycolor from 'tinycolor2';
import Slider from 'react-native-smooth-slider';

export class SliderValuePicker extends React.Component {

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
        minimumTrackTintColor: PropTypes.string,
        maximumTrackTintColor: PropTypes.string,
        moveVelocityThreshold: PropTypes.number,    // Prevent onValueChange if slide too faster
    };

    static defaultProps = {
        minimumValue: 0.01, // 0 will cause h and s to 0 too, so 0.01 by default
        maximumValue: 1,
        step: 0.01,
        minimumTrackTintColor: '#3f3f3f',
        maximumTrackTintColor: '#b3b3b3',
        moveVelocityThreshold: 2000,
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
            v: x,
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
            minimumTrackTintColor,
            maximumTrackTintColor,
            minimumValue,
            maximumValue,
            step,
            moveVelocityThreshold,
        } = this.props;

        let thumbColor = tinycolor({
            ...color,
            s: 0,
        }).toHexString();

        let borderRadius = styles.style.borderRadius;
        if (style) {
            if (style.hasOwnProperty('borderRadius')) {
                borderRadius = style.borderRadius;
            } else if (style.hasOwnProperty('height')) {
                borderRadius = style.height / 2;
            }
        }
        if (trackStyle) {
            if (trackStyle.hasOwnProperty('borderRadius')) {
                borderRadius = trackStyle.borderRadius;
            } else if (trackStyle.hasOwnProperty('height')) {
                borderRadius = trackStyle.height / 2;
            }
        }

        return (
            <View style={styles.container}>
                <Slider
                    style={style || styles.style}
                    trackStyle={[{backgroundColor: 'transparent'}, trackStyle, {borderRadius}]}
                    trackImage={trackImage}
                    thumbStyle={[{backgroundColor: thumbColor}, thumbStyle]}
                    minimumTrackTintColor={minimumTrackTintColor}
                    maximumTrackTintColor={maximumTrackTintColor}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    value={color.v}
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
    style: {
        height: 12,
        borderRadius: 6,
    },
});
