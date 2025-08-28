import React from 'react';
import HomeFeed from '../components/HomeFeed';

const Home: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa' }}>
            <div
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '20px',
                    paddingTop: '60px',
                }}
            >
                {/* Лента постов */}
                <HomeFeed />
            </div>
        </div>
    );
};

export default Home;
