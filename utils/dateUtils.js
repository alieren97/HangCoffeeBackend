exports.calculateDateDifference = (createdAt, today) => {
    const diffMilliseconds = Math.abs(createdAt - today);

    const days = parseInt(diffMilliseconds / (1000 * 60 * 60 * 24));
    const hours = parseInt((diffMilliseconds / (1000 * 60 * 60)) % 24);
    const minutes = parseInt((diffMilliseconds / (1000 * 60)) % 60);
    const seconds = parseInt((diffMilliseconds / 1000) % 60);

    return { days, hours, minutes, seconds };
}

exports.formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', };
    return date.toLocaleDateString('tr-TR', options);
};
