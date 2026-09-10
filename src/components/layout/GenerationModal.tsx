'use client';

import React from 'react';
import { GenerationProcessingModal, GenerationProcessingModalProps } from './GenerationProcessingModal';

export const GenerationModal: React.FC<GenerationProcessingModalProps> = (props) => {
  return <GenerationProcessingModal {...props} />;
};

export { GenerationProcessingModal };
export type { GenerationProcessingModalProps };
