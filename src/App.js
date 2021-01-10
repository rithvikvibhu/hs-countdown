import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import dayjs from 'dayjs';
import './App.css';
import confetti from './confetti';

dayjs.extend(require('dayjs/plugin/relativeTime'));

function App() {
  const [isDark, setIsDark] = useState(false);
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const pastEvents = events.filter((x) => x.height < data.currentHeight);
  const futureEvents = events.filter((x) => x.height >= data.currentHeight);

  if (futureEvents.length && data.currentHeight === futureEvents[0].height) {
    confetti();
  }

  useEffect(() => {
    const socket = socketIOClient('/');
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
        background: isDark
          ? 'radial-gradient(circle, rgba(6,6,6,1) 0%, rgba(22,22,22,1) 100%)'
          : 'radial-gradient(50% 50% at 50% 50%, #3182CE 0%, #2B6CB0 100%)',
      }}
    >
      {/* Header */}
      <Header isDark={isDark} setIsDark={setIsDark} />

      {/* Main Text */}
      {data.currentHeight ? (
        <MainText
          futureEvents={futureEvents}
          currentHeight={data.currentHeight}
        />
      ) : (
        <h3 className='mt-16 text-2xl text-center'>Loading...</h3>
      )}

      {/* Events List */}
      {events.length ? (
        <Events pastEvents={pastEvents} futureEvents={futureEvents} />
      ) : (
        ''
      )}
    </div>
  );
}

function Header(props) {
  return (
    <div>
      <div className='p-4 w-full flex items-center justify-between'>
        <label
          onClick={() => props.setIsDark(!props.isDark)}
          className='relative h-5 w-9 px-2 flex items-center justify-between text-xs rounded-full bg-gray-800'
        >
          <i className='text-yellow-500'>D</i>
          <i className='text-yellow-600'>L</i>
          <div
            className={`absolute left-0.5 h-4 w-4 rounded-full bg-white transition duration-200 ${
              props.isDark ? 'transform translate-x-5' : ''
            }`}
          ></div>
        </label>
        <a
          href='https://github.com/rithvikvibhu/hs-countdown'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          GitHub / Submit new event
        </a>
      </div>
      <h1 className='mt-8 md:mt-0 text-xl text-center'>
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
  if (props.futureEvents.length === 0) {
    return (
      <h3 className='mt-16 px-8 text-2xl text-center'>
        No upcoming events.
        <br />
        <a
          href='https://github.com/rithvikvibhu/hs-countdown'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          Add one now!
        </a>
      </h3>
    );
  }
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

function Events(props) {
  return (
    <div className='mt-10 w-full md:flex font-light'>
      <div className='mt-10 flex-1 text-center'>
        <h5 className='mb-1 font-medium'>Past Events</h5>
        <EventsList events={props.pastEvents} />
      </div>
      <div className='mt-10 flex-1 text-center'>
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

export default App;
