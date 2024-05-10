import React, { useState } from 'react';
import "./notification.css";
const NotificationBadge = ({ count }) => {
    return (
        <div className="notification-badge">
            {count > 0 && <span>{count}</span>}
        </div>
    );
};

export default NotificationBadge;
