import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/sections/Hero/Hero'; // ❌ hapus
import Destination from '../../components/sections/Destination/Destination';
import Gallery from '../../components/sections/Gallery/Gallery';
import Culture from '../../components/sections/Culture/Culture';
import Article from '../../components/sections/Article/Article';
import Contact from '../../components/sections/Contact/Contact';
import FooterSetting from '../../components/sections/FooterSetting/FooterSetting';
import './Home.css';

const Home = () => {
    return (
        <>
            <Navbar />
            <main className="home">
                <Hero />
                <Destination />
                <Gallery />
                <Culture />
                <Article />
                <Contact />
            </main>
            <FooterSetting />
        </>
    );
};

export default Home;