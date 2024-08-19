function date(createdAt){
    const date = new Date(createdAt);
    const newDate= date.toLocaleDateString();
    return newDate;
}

export default date;