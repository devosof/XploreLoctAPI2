// controllers/organizerController.js
// controllers/organizerController.js
import Organizer from '../models/Organizers.js';
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import knex from '../db/db.js';

// Register as an organizer
export const registerOrganizer = AsyncHandler(async (req, res) => {
  try {
    const { organization_key } = req.body;
    console.log(organization_key);

    // Look up the organization using the provided key
    const organization = await knex('organizations')
      .where({ organization_key: organization_key })
      .first();

    if (!organization) {
      throw new ApiError(403, "Invalid organization key");
    }

    // Check if the user is already registered as an organizer for this organization
    const existingOrganizer = await Organizer.findByUserIdAndOrgId(req.user.id, organization.organization_id);
    if (existingOrganizer) {
      throw new ApiError(409, "User is already registered as an organizer for this organization");
    }

    // Register the user as an organizer if the organization is valid
    const newOrganizer = await Organizer.create({
      user_id: req.user.id,
      organization_id: organization.organization_id, // Link to organization
    });

    res.status(201).json(new ApiResponse(201, newOrganizer, 'Registered as organizer successfully'));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error(error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});

// Get organizer details
// export const getOrganizer = AsyncHandler(async (req, res) => {
//     try {
//       // Retrieve organizer details along with user and organization information
//       const organizer = await knex('organizers')
//         .join('users', 'organizers.user_id', '=', 'users.id') // Join with users table
//         .join('organizations', 'organizers.organization_id', '=', 'organizations.organization_id') // Join with organizations table
//         .select(
//           'organizers.organizer_id',
//           'organizers.user_id',
//           'users.username as organizer_name', // Select user details
//           'users.email as organizer_email',
//           'users.phone as organizer_contact',
//           'organizations.name as organization_name', // Select organization details
//         )
//         .where('organizers.user_id', req.user.id) // Filter by the logged-in user
//         .first();
  
//       if (!organizer) {
//         throw new ApiError(404, 'Organizer not found');
//       }
  
//       // Return the limited details
//       res.json(new ApiResponse(200, organizer, 'Organizer details retrieved'));
//     } catch (error) {
//       if (error instanceof ApiError) {
//         return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
//       }
  
//       console.error(error);
//       res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
//     }
//   });


export const getOrganizer = AsyncHandler(async (req, res) => {
  try {
    // Retrieve organizer details along with user and organization information
    const organizer = await knex('organizers')
      .join('users', 'organizers.user_id', '=', 'users.id') // Join with users table
      .join('organizations', 'organizers.organization_id', '=', 'organizations.organization_id') // Join with organizations table
      .select(
        'organizers.organizer_id',
        'organizers.user_id',
        'users.username AS organizer_name', // Organizer's username
        'users.email AS organizer_email',   // Organizer's email
        'users.phone AS organizer_contact', // Organizer's contact
        knex.raw(
          'json_build_object(' +
            '\'organization_id\', organizations.organization_id,' +
            '\'name\', organizations.name,' +
            '\'contact_email\', organizations.contact_email,' +
            '\'contact_phone\', organizations.contact_phone,' +
            '\'address\', organizations.address,' +
            '\'logo_url\', organizations.logo_url' +
          ') AS organization' // Build organization object, excluding organization_key
        )
      )
      .where('organizers.user_id', req.user.id) // Filter by logged-in user
      .first();

    if (!organizer) {
      throw new ApiError(404, 'Organizer not found');
    }

    // Return the details with organization as an object
    res.status(200).json(new ApiResponse(200, organizer, 'Organizer details retrieved successfully'));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error("Error fetching organizer details:", error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});

  



// export const getOrganizer = AsyncHandler(async (req, res) => {
//   try {
//     const organizer = await Organizer.findByUserId(req.user?.id);
//     if (!organizer) throw new ApiError(404, 'Organizer not found');

//     // // Check if the user is authorized to access this organizer
//     // if (organizer.user_id !== req.user.id) {
//     //   throw new ApiError(403, 'You do not have permission to access this organizer profile');
//     // }

//     res.json(new ApiResponse(200, organizer, 'Organizer details retrieved'));
//   } catch (error) {
//     if (error instanceof ApiError) {
//       return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
//     }

//     console.error(error);
//     res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
//   }
// });

// Update organizer details
export const updateOrganizer = AsyncHandler(async (req, res) => {
  try {
    const organizer = await Organizer.findByUserId(req.user.id);
    if (!organizer) throw new ApiError(404, 'Organizer not found');

    // Check if the user is authorized to update this organizer
    if (organizer.user_id !== req.user.id) {
      throw new ApiError(403, 'You do not have permission to update this organizer profile');
    }

    const updatedOrganizer = await Organizer.update(req.user.id, req.body);
    res.json(new ApiResponse(200, updatedOrganizer, 'Organizer details updated'));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error(error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});

// Delete organizer account
export const deleteOrganizer = AsyncHandler(async (req, res) => {
  try {
    const organizer = await Organizer.findByUserId(req.user.id);
    if (!organizer) throw new ApiError(404, 'Organizer not found');

    // Check if the user is authorized to delete this organizer
    if (organizer.user_id !== req.user.id) {
      throw new ApiError(403, 'You do not have permission to delete this organizer profile');
    }

    await Organizer.delete(req.user.id);
    res.json(new ApiResponse(200, 'Organizer account deleted'));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, 'An unexpected error occurred'));
  }
});












// // controllers/organizerController.js
// import Organizer from '../models/Organizers.js';
// import { AsyncHandler } from '../utils/AsyncHandler.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { ApiError } from '../utils/ApiError.js';
// import knex from '../db/db.js';



// // Register as an organizer

// // Register as an organizer
// export const registerOrganizer = AsyncHandler(async (req, res) => {
//     const { organization_key } = req.body;
//     console.log(organization_key)
  
//     // Look up the organization using the provided key
//     const organization = await knex('organizations')
//       .where({ organization_key: organization_key })
//       .first();
  
//     if (!organization) {
//       throw new ApiError(403, "Invalid organization key");
//     }
  
//     // Register the user as an organizer if the organization is valid
//     const newOrganizer = await Organizer.create({
//       user_id: req.user.id,
//       organization_id: organization.organization_id, // Link to organization
//     });
  
//     res.status(201).json(new ApiResponse(201, newOrganizer, 'Registered as organizer successfully'));
//   });
  
// // export const registerOrganizer = AsyncHandler(async (req, res) => {
// //   const { organizationKey, name, email, phone, organization } = req.body;

// //   if (organizationKey !== process.env.ORGANIZATION_KEY) {
// //     throw new ApiError(403, "Invalid organization key");
// //   }

// //   const newOrganizer = await Organizer.create({ user_id: req.user.id, name, email, phone, organization });
// //   res.status(201).json(new ApiResponse(201, newOrganizer, 'Registered as organizer successfully'));
// // });

// // Get organizer details
// export const getOrganizer = AsyncHandler(async (req, res) => {
//   const organizer = await Organizer.findByUserId(req.user.id);
//   if (!organizer) throw new ApiError(404, 'Organizer not found');
//   res.json(new ApiResponse(200, organizer, 'Organizer details retrieved'));
// });

// // Update organizer details
// export const updateOrganizer = AsyncHandler(async (req, res) => {
//   const updatedOrganizer = await Organizer.update(req.user.id, req.body);
//   if (!updatedOrganizer) throw new ApiError(404, 'Organizer not found');
//   res.json(new ApiResponse(200, updatedOrganizer, 'Organizer details updated'));
// });

// // Delete organizer account
// export const deleteOrganizer = AsyncHandler(async (req, res) => {
//   await Organizer.delete(req.user.id);
//   res.json(new ApiResponse(200, 'Organizer account deleted'));
// });
