// Backendless may have a limit of 100 pages. Need to revisit this in the future.
import Backendless from "backendless";


export const getAllDataFromBackendless = async () => {
    let OSD = [];
    await Backendless.Data.of("osd_pages").find()
        .then(function(response) {
            OSD = response;
            //console.log("base", OSD);
            localStorage.setItem("OSD", JSON.stringify(OSD));
            return OSD;
        })
        .catch(function(error) {
            console.log(error)
            return OSD;
        });
}


export const getAllCategories = () => {
    // Grab latest storage info
    let OSD = JSON.parse(localStorage.getItem("OSD"));

    // Grab all the categories out of the array
    let categories = OSD.map(item => item.category);
    // Filter out duplicates
    categories = [...new Set(categories)];

    categories.sort();

    return categories;
}

