export const removeNode = (selector) => document.querySelector(selector).remove()

export const calculateAge = function (birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime()
    var ageDate = new Date(ageDifMs) // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970)
}
