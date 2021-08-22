// Backendless may have a limit of 100 pages. Need to revisit this in the future.
import Backendless from "backendless";
import {goto} from "$app/navigation";


export const getUserDetailsFromBackendless = async () => {
    let userDetails;

    await Backendless.UserService.getCurrentUser()
        .then(function(response) {
            if(response === null && window.location.pathname !== "/access") {
                goto("/access")
            }
        })
        .catch(function(error) {
            console.log(error)
            goto("/access")
        });
}


export const getAllDataFromBackendless = async () => {
    let OSD = [];

    // Backendless has a default of 10 items and a limit of 100 items
    // Once the limit gets higher, we can just use setOffset a dozen times and
    // fake the limit to 1000
    let queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize(100);

    await Backendless.Data.of("osd_pages").find(queryBuilder)
        .then(function(response) {
            OSD = response;
            localStorage.setItem("OSD", JSON.stringify(OSD));
            return OSD;
        })
        .catch(function(error) {
            // TODO: Create an error for this
            console.log(error)
        });
}


export const getAllCategories = () => {
    // Grab latest storage info
    let OSD = JSON.parse(localStorage.getItem("OSD"));

    let categories = [];

    if(OSD !== null) {
        // Grab all the categories out of the array
        categories = OSD.map(item => {
            // Verify page is not archived
            if(!item['archived']) {
                return item.category;
            }
        });


        // Filter out duplicates
        categories = [...new Set(categories)];

        // Map returns undefined for some reason
        // This filters anything that's not truthy :)
        categories = categories.filter(Boolean)

        // Sort alphabetically
        categories.sort();
    }

    return categories;
}

