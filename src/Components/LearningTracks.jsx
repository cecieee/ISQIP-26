import { useState } from 'react';

const styles = {
  container: {
    padding: '60px',
  },

  tracksContainer: {
    display: 'flex',
    gap: '40px',
  },

  track: {
    flex: 1,
    padding: '30px',
    border: '1px solid #0CE644',
    borderRadius: '12px',
  },
};

const LearningTracks = () => {
  const [learningTracks, setLearningTracks] = useState([
    {
      id: 1,
      name: 'Understanding VLSI',
      description: 'Description for Understanding VLSI',
    },
    {
      id: 2,
      name: 'Neural Networks and Gen AI',
      description: 'Description for Neural Networks and Gen AI',
    },
    {
      id: 3,
      name: 'From Sunlight to Electricity',
      description: 'Description for From Sunlight to Electricity',
    },
    {
      id: 4,
      name: 'The Future of Computing',
      description: 'Description for The Future of Computing',
    },
    {
        id:5,
        name: 'Evolution of EV',
        description: 'Description for Evolution of EV',
    },
  ]);

  return (
    <div style={styles.container}>
      <h1>Learning Tracks</h1>

      <div style={styles.tracksContainer}>
        {learningTracks.map(track => (
          <div style={styles.track} key={track.id}>
            <h2>{track.name}</h2>
            <p>{track.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningTracks;