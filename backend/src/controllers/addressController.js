import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return sendSuccess(res, 'Addresses fetched successfully.', { addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return sendError(res, 'All address fields are required.', 'VALIDATION_ERROR', 400);
    }

    if (isDefault) {
      // Unset previous default
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault: Boolean(isDefault),
      },
    });

    return sendSuccess(res, 'Address added successfully.', { address }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressId = parseInt(id, 10);
    const { fullName, phone, addressLine, city, state, pincode, isDefault } = req.body;

    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== req.user.id) {
      return sendError(res, 'Address not found.', 'NOT_FOUND', 404);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName: fullName || existing.fullName,
        phone: phone || existing.phone,
        addressLine: addressLine || existing.addressLine,
        city: city || existing.city,
        state: state || existing.state,
        pincode: pincode || existing.pincode,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : existing.isDefault,
      },
    });

    return sendSuccess(res, 'Address updated successfully.', { address: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressId = parseInt(id, 10);

    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== req.user.id) {
      return sendError(res, 'Address not found.', 'NOT_FOUND', 404);
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return sendSuccess(res, 'Address deleted successfully.');
  } catch (error) {
    next(error);
  }
};
