import { NextFunction, Request, Response } from "express";
import capitalize from "../utils/capitalize";
import pluralize from 'pluralize';

type ValidationFunction = (field: string, data: any) => (string | null);

const isRequired = (field: string, data: any) => {  
  if (data === undefined) {
    return `${field} is required`
  }

  return null;
}

const isNotEmpty = (field: string, data: any) => {
  if (String(data).length === 0) {
    return `${field} cannot be an empty string`
  }

  return null;
}

const containOneAtCharacter = (field: string, data: any) => {
  if ((String(data).match(/@/g) || []).length !== 1) {
    return `${field} must contain one @ character`
  }

  return null;
}

const isLongerThan = (length: number) => (field: string, data: any) => {
  if(length < 0) {
    throw new Error(`Length cannot be a negative value`)
  }

  if (String(data).length <= length) {
    return `${field} must contain at least ${length+1} characters`
  }

  return null;
}


const hasAtLeast = (type: "number" | "lowercase" | "uppercase", quantity: number) => (field: string, data: any) => {
  const types = {
    "number": {
      reg: /[0-9]/g,
      error: pluralize('number', quantity)
    },
    "lowercase": {
      reg: /[a-z]/g,
      error: `lowercase ${pluralize('character', quantity)}`
    },
    "uppercase": {
      reg: /[A-Z]/g,
      error: `uppercase ${pluralize('character', quantity)}`
    },
  }
  
  if(quantity <= 0) {
    throw new Error(`Quantity cannot be equal to or lesser than zero`)
  }

  if ((String(data).match(types[type].reg) || []).length < quantity) {
    return `${field} must contain at least ${quantity} ${types[type].error}`
  }

  return null;
}

const chain = (field: string, optional: boolean) => (...steps: ValidationFunction[]) => (req: Request, res: Response, next: NextFunction) => {
  if (optional && req.body[field] === undefined) {
    next();
    return;
  }
  
  for (const step of [ isRequired, ...steps]) {
    const message = step(capitalize(field), req.body[field]);

    if (message !== null) {
      return res.status(400).json({
        status: 400,
        message
      });
    }
  }

  next();
  return;
}

export const validate = (field: string, optional = false) => ({
  isEmail: chain(field, optional)(
    isNotEmpty,
    containOneAtCharacter,
  ),
  
  isPassword: chain(field, optional)(
    isNotEmpty,
    isLongerThan(7),
    hasAtLeast("lowercase", 1),
    hasAtLeast("uppercase", 1),
    hasAtLeast("number", 1)
  ),
  
  isNotEmpty: chain(field, optional)(
    isNotEmpty
  ),

  check: (...validationSteps: ValidationFunction[]) => chain(field, optional)(
    ...validationSteps
  )
});

export const Validators = {
  isNotEmpty,
  containOneAtCharacter,
  isLongerThan,
  hasAtLeast,
}