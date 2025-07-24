<?php
/**
 * Plugin Name: WooCommerce ACF Integration
 * Description: Enables Advanced Custom Fields (ACF) in WooCommerce REST API responses
 * Version: 1.0.0
 * Author: Flora Distro
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add ACF fields to WooCommerce REST API product responses
 */
add_filter('woocommerce_rest_prepare_product_object', 'add_acf_to_woocommerce_api', 10, 3);

function add_acf_to_woocommerce_api($response, $object, $request) {
    // Check if ACF is active
    if (!function_exists('get_fields')) {
        return $response;
    }
    
    // Get ACF fields for this product
    $acf_fields = get_fields($object->get_id());
    
    // Add ACF fields to response if they exist
    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    } else {
        // Return empty object instead of null for consistency
        $response->data['acf'] = new stdClass();
    }
    
    return $response;
}

/**
 * Alternative method: Register individual ACF fields for REST API
 * This ensures each field is properly exposed
 */
add_action('rest_api_init', 'register_acf_fields_for_rest');

function register_acf_fields_for_rest() {
    // Check if ACF is active
    if (!function_exists('acf_get_field_groups')) {
        return;
    }
    
    // Get all ACF field groups
    $field_groups = acf_get_field_groups();
    
    foreach ($field_groups as $field_group) {
        // Only process field groups assigned to products
        $locations = $field_group['location'];
        $is_product_group = false;
        
        foreach ($locations as $location_group) {
            foreach ($location_group as $location) {
                if ($location['param'] === 'product_cat') {
                    $is_product_group = true;
                    break 2;
                }
            }
        }
        
        if (!$is_product_group) {
            continue;
        }
        
        // Get fields for this group
        $fields = acf_get_fields($field_group['key']);
        
        foreach ($fields as $field) {
            register_rest_field(
                'product',
                $field['name'],
                array(
                    'get_callback' => function($object) use ($field) {
                        $value = get_field($field['name'], $object['id']);
                        return $value ?: '';
                    },
                    'update_callback' => null,
                    'schema' => array(
                        'description' => $field['label'],
                        'type' => 'string',
                        'context' => array('view', 'edit'),
                    ),
                )
            );
        }
    }
}

/**
 * Ensure ACF fields are included in product variations as well
 */
add_filter('woocommerce_rest_prepare_product_variation_object', 'add_acf_to_woocommerce_variation_api', 10, 3);

function add_acf_to_woocommerce_variation_api($response, $object, $request) {
    // Check if ACF is active
    if (!function_exists('get_fields')) {
        return $response;
    }
    
    // Get ACF fields for this variation
    $acf_fields = get_fields($object->get_id());
    
    // Add ACF fields to response if they exist
    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    } else {
        // Return empty object instead of null for consistency
        $response->data['acf'] = new stdClass();
    }
    
    return $response;
}

/**
 * Add debug information to help troubleshoot ACF integration
 */
add_action('wp_ajax_debug_acf_integration', 'debug_acf_integration');
add_action('wp_ajax_nopriv_debug_acf_integration', 'debug_acf_integration');

function debug_acf_integration() {
    // Check if user has proper permissions
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }
    
    $debug_info = array();
    
    // Check if ACF is active
    $debug_info['acf_active'] = function_exists('get_fields');
    $debug_info['acf_version'] = defined('ACF_VERSION') ? ACF_VERSION : 'Not installed';
    
    // Check if WooCommerce is active
    $debug_info['woocommerce_active'] = class_exists('WooCommerce');
    $debug_info['woocommerce_version'] = defined('WC_VERSION') ? WC_VERSION : 'Not installed';
    
    // Get ACF field groups
    if (function_exists('acf_get_field_groups')) {
        $field_groups = acf_get_field_groups();
        $debug_info['field_groups'] = array();
        
        foreach ($field_groups as $group) {
            $debug_info['field_groups'][] = array(
                'title' => $group['title'],
                'key' => $group['key'],
                'active' => $group['active'],
                'location' => $group['location']
            );
        }
    }
    
    // Get sample product with ACF fields
    $products = wc_get_products(array('limit' => 1));
    if (!empty($products)) {
        $product = $products[0];
        $debug_info['sample_product'] = array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'acf_fields' => function_exists('get_fields') ? get_fields($product->get_id()) : 'ACF not available'
        );
    }
    
    wp_send_json($debug_info);
}

/**
 * Add admin notice if ACF is not installed
 */
add_action('admin_notices', 'acf_integration_admin_notice');

function acf_integration_admin_notice() {
    if (!function_exists('get_fields')) {
        echo '<div class="notice notice-warning is-dismissible">';
        echo '<p><strong>WooCommerce ACF Integration:</strong> Advanced Custom Fields plugin is required for this integration to work properly.</p>';
        echo '</div>';
    }
}

/**
 * Log ACF field requests for debugging
 */
add_action('woocommerce_rest_product_object_query', 'log_acf_requests');

function log_acf_requests($args, $request) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('WooCommerce API Request with ACF: ' . print_r($request->get_params(), true));
    }
}
?> 