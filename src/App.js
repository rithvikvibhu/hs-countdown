import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import dayjs from 'dayjs';
import './App.css';
import confetti from './confetti';

dayjs.extend(require('dayjs/plugin/relativeTime'));

function App() {
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const pastEvents = events.filter((x) => x.height < data.currentHeight);
  const futureEvents = events.filter((x) => x.height >= data.currentHeight);

  if (futureEvents.length && data.currentHeight === futureEvents[0].height) {
    confetti();
  }

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3001');
    socket.on('newData', (res) => {
      setData(res);
      console.log('data', res);
    });
    socket.on('events', (res) => {
      setEvents(res);
      console.log('events', res);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='w-full min-h-screen text-white bg-blue-700'
      style={{
        background:
          'radial-gradient(50% 50% at 50% 50%, #3182CE 0%, #2B6CB0 100%)',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Text */}
      {futureEvents.length ? (
        <MainText
          futureEvents={futureEvents}
          currentHeight={data.currentHeight}
        />
      ) : (
        ''
      )}

      {/* Events List */}
      {futureEvents.length ? (
        <Events pastEvents={pastEvents} futureEvents={futureEvents} />
      ) : (
        ''
      )}
    </div>
  );
}

function Events(props) {
  return (
    <div className='mt-20 w-full flex font-light'>
      <div className='flex-1 text-center'>
        <h5 className='mb-1 font-medium'>Past Events</h5>
        <EventsList events={props.pastEvents} />
      </div>
      <div className='flex-1 text-center'>
        <h5 className='mb-1 font-medium'>Up Next</h5>
        <EventsList events={props.futureEvents} />
      </div>
    </div>
  );
}

function EventsList(props) {
  const eventsItems = props.events.map((event, idx) => (
    <li key={idx}>
      {event.name} - Block {event.height}
    </li>
  ));
  return <ul>{eventsItems}</ul>;
}

function Header() {
  return (
    <div>
      <div className='p-4 w-full text-right'>
        <a
          href='https://github.com/rithvikvibhu/hs-countdown'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          GitHub / Submit new event
        </a>
      </div>
      <h1 className='text-xl text-center'>
        <img
          src='https://handshake.org/images/landing/logo-light.svg'
          alt='Handshake'
          className='inline-block'
        />
        <br />
        Countdown
      </h1>
    </div>
  );
}

function MainText(props) {
  const blocksToNextEvent = props.futureEvents[0].height - props.currentHeight;
  let timeToNextEvent;
  if (blocksToNextEvent === 0) {
    timeToNextEvent = 'right about now!';
  } else {
    timeToNextEvent = dayjs().to(
      dayjs().add(blocksToNextEvent * 10, 'minute'),
      true
    );
  }

  return (
    <div className='mt-16 text-center'>
      <h3 className='text-4xl font-light'>
        {(props.futureEvents.length && props.futureEvents[0].name) || ''}{' '}
        {blocksToNextEvent ? 'in' : ''}
      </h3>
      <h2 className='mt-3 text-5xl'>
        {timeToNextEvent}
        {blocksToNextEvent !== 0 && (
          <span
            className='text-xl font-light border-b border-dashed'
            title='Approx. based on average block time'
          >
            ish<sup className='text-xs'>❔</sup>
          </span>
        )}
      </h2>
      <h4 className='mt-3 text-2xl font-extralight'>
        {blocksToNextEvent} block{blocksToNextEvent !== 1 ? 's' : ''} to go
      </h4>
    </div>
  );
}

export default App;
