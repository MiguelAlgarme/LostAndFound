import React from "react";
import { ReactNode } from 'react';

declare module '*.jsx' {
  const value: any;
  export default value;
}