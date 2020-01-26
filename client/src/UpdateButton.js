import React from 'react';
import Button from '@material-ui/core/Button';

export default (props) => {

    const {updateTargetTemperature, ...rest} = props;

    return (
        <Button
            onClick={() => updateTargetTemperature(props.increment)}
            variant="outlined"
            {...rest}
        >
            {props.children}
        </Button>);
}
