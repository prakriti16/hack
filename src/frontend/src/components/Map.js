import React from 'react';

import '../styles/style_home.css';
export const Map = () => {
    return (
        <div id = "map" className="map-container">
            <h2 className='section-title'>Our Location</h2>
            <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7690.045680233958!2d74.93759603494875!3d15.483203581238502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf33000eae4af5%3A0x4ba10694b8aa8167!2sWellness%20Centre!5e0!3m2!1sen!2sin!4v1729937763056!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default Map;
