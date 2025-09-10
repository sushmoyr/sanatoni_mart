import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface TransProps {
    /**
     * Translation key (supports dot notation)
     */
    k: string;
    
    /**
     * Replacements for placeholders in the translation
     */
    replacements?: Record<string, string | number>;
    
    /**
     * Fallback text if translation is not found
     */
    fallback?: string;
    
    /**
     * HTML tag to wrap the translation
     */
    as?: keyof JSX.IntrinsicElements;
    
    /**
     * Additional props to pass to the wrapper element
     */
    [key: string]: any;
}

/**
 * Translation component for easy inline translations
 * 
 * @example
 * <Trans k="common.save" />
 * <Trans k="products.add_to_cart" as="button" className="btn" />
 * <Trans k="navigation.welcome" replacements={{ name: 'John' }} />
 */
export function Trans({ 
    k, 
    replacements = {}, 
    fallback, 
    as: Component = 'span',
    ...props 
}: TransProps) {
    const { t } = useTranslation();
    
    return (
        <Component {...props}>
            {t(k, replacements, fallback)}
        </Component>
    );
}

export default Trans;
