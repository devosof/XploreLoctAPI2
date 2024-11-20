// controllers/adminController.js
import Organization from '../models/Organization.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';


//GET Admin

export const getAdmin = async(req, res, next) => {
    
}



// Admin login
export const loginAdmin = async (req, res, next) => {
    try {
        const { user, adminSecret } = req.body;
        if (user !== process.env.ADMIN_NAME && adminSecret !== process.env.ADMIN_SECRET) {
            throw new ApiError(403, 'Unauthorized');
        }

        // Generate an admin token
        const token = jwt.sign({ isAdmin: true }, process.env.ADMIN_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200)
        .cookie("Token", token, {httpOnly: true})
        .json(new ApiResponse(200, { user, token }, 'Admin login successful'));
    } catch (error) {
        next(error);
    }
};

// Create a new organization
export const createOrganization = async (req, res, next) => {
    try {
        const { name, organization_key, contact_email, contact_phone, address } = req.body;
        
        
        const logoLocalPath = req.file?.path;
        const logo = logoLocalPath ? await uploadOnCloudinary(logoLocalPath) : null
        

        const newOrganization = await Organization.create({
            name,
            organization_key,
            contact_email,
            contact_phone,
            address,
            logo_url: logo ? logo.url : null
        });

        res.status(201).json(new ApiResponse(201, newOrganization, "Organization created successfully"));
    } catch (error) {
        console.log(error)
        next(new ApiError(500, "Failed to create organization", error));
    }
};

// Update an organization
export const updateOrganization = async (req, res, next) => {
    try {
        const { organization_id } = req.params;
        const { name, organization_key, contact_email, contact_phone, address } = req.body;

        let logo_url = null;
        if (req.file) {
            const logo = await uploadOnCloudinary(req.file.path);
            logo_url = logo.url;
        }

        const updatedOrganization = await Organization.update(organization_id, {
            name,
            organization_key,
            contact_email,
            contact_phone,
            address,
            ...(logo_url && { logo_url })
        });

        if (!updatedOrganization) {
            throw new ApiError(404, 'Organization not found');
        }

        res.status(200).json(new ApiResponse(200, updatedOrganization, "Organization updated successfully"));
    } catch (error) {
        next(new ApiError(500, "Failed to update organization", error));
    }
};

// Delete an organization
export const deleteOrganization = async (req, res, next) => {
    try {
        const { organization_id } = req.params;
        const deleted = await Organization.delete(organization_id);

        if (!deleted) {
            throw new ApiError(404, 'Organization not found');
        }

        res.status(200).json(new ApiResponse(200, null, "Organization deleted successfully"));
    } catch (error) {
        next(new ApiError(500, "Failed to delete organization", error));
    }
};
