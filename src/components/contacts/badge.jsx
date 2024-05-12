import React, { useState } from 'react';
import "./badge.css";
const NotificationBadge = ({ count }) => {
    return (
        <div className="notification-badge">
            {count > 0 && <span>{count}</span>}
        </div>
    );
};

export default NotificationBadge;
