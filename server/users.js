const users = [];

const addUser = ({ id, name, room, isAdmin, userImage }) => {

    //name = name.trim().toLowerCase();
    //room = room.trim().toLowerCase();

    const existingUser = users.find((user) => {
        user.room === room && user.name === name
    });

    if (existingUser) {
        return { error: "Username is taken" };
    }
    const user = { id, name, room, isAdmin };

    users.push(user);

    return { user };

}

const removeUser = (id) => {

    //if users contains item with same id as id, remove it
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

}
const addimage = (id, image) => {
    const user = users.find((user) => user.id === id);
    if (user) {
        user.image = image;
    }
}

const getUser = (id) => users
    .find((user) => user.id === id);

const getUsersInRoom = (room) => users
    .filter((user) => user.room === room);

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addimage
};