import React, {useState, useEffect, Fragment, useCallback, useRef } from 'react';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { makeStyles } from '@material-ui/core/styles';
import Button from './UpdateButton';

const SERVER_NAME = 'http://localhost:9090/';

const useStyles = makeStyles({
    container: {
        paddingTop: '10%',
        textAlign: 'center'
    },
    heading: {
        marginBottom: '2rem'
    },
    sub: {
        color: 'gray',
        fontSize: '0.7rem',
        marginBottom: '1rem'
    }
});

function App() {
  const [currentTemperature, setCurrentTemperature] = useState();
  const [lastUpdate, setLastUpdate] = useState();
  const [targetTemperature, setTargetTemperature] = useState();
  const [onHoldTargetTemperature, setOnHoldTargetTemperature] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateInterval = useRef();
  let currOnHoldTemperature;

  const makeFetchUpdate = useCallback(async (newVal) => {
      const updatedVal = newVal || onHoldTargetTemperature;

      if(!isUpdating && updatedVal!==targetTemperature) {
          setIsUpdating(true);
          await fetch(SERVER_NAME, {
              headers: { "Content-Type": "application/json; charset=utf-8" },
              method: 'PATCH',
              body: JSON.stringify({currentSetpoint: updatedVal})
          });

          setIsUpdating(false);
      }
  }, [isUpdating, onHoldTargetTemperature, targetTemperature]);

  useEffect(() => {

      clearInterval(updateInterval.current);
      const fetchJson = (async () => {
          updateInterval.current = setInterval(async() => {
              const data = await fetch(SERVER_NAME);
              if(data.status === 200) {
                  const resp = await data.json();
                  setCurrentTemperature(resp.currentTemp);
                  setTargetTemperature(resp.currentSetpoint);
                  setLastUpdate(moment(resp.timestamp).format('DD-MM-YYYY H:mm:ss'));

                  if(resp.currentSetpoint !== onHoldTargetTemperature && onHoldTargetTemperature) {
                      makeFetchUpdate()
                  }
              }
          }, 2000);
      });

      fetchJson();

      return () => {clearInterval(updateInterval.current)};
  }, [setCurrentTemperature, onHoldTargetTemperature, makeFetchUpdate])

  const updateTargetTemperature = (change) => {
      const baseTemp = (onHoldTargetTemperature || targetTemperature);
      currOnHoldTemperature = change ? baseTemp+change : baseTemp;
      if(currOnHoldTemperature === onHoldTargetTemperature) return;

      setOnHoldTargetTemperature(currOnHoldTemperature); //holds the desired temperature for next render
      makeFetchUpdate(currOnHoldTemperature);

  };

  const classes = useStyles();

  return (
    <Container fixed className={classes.container}>
      {currentTemperature && (
          <Fragment>
              <h1 className={classes.heading}>Room name</h1>
              <h2>{currentTemperature}˚</h2>
              <div className={classes.sub}>Last updated: {lastUpdate}</div>
              <div>
                <Button increment={0.5} updateTargetTemperature={updateTargetTemperature} color="secondary">
                    <ArrowDropUpIcon />
                </Button>
              </div>
              <h3>Target: {onHoldTargetTemperature || targetTemperature}˚</h3>
              <div>
                <Button increment={-0.5} updateTargetTemperature={updateTargetTemperature} color="primary" >
                    <ArrowDropDownIcon />
                </Button>
              </div>
          </Fragment>
      )}
      {!currentTemperature && <h3>Loading...</h3>}
    </Container>
  );
}

export default App;
