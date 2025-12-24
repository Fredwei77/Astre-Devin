/**
 * 风水商品购物服务
 * Feng Shui Shop Service
 */

(function () {
    'use strict';

    const ShopService = {
        /**
         * 商品管理
         */
        products: {
            /**
             * 获取所有商品
             */
            async getAll(filters = {}) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    let query = client
                        .from('products')
                        .select('*')
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true });

                    if (filters.category) {
                        query = query.eq('category', filters.category);
                    }

                    if (filters.featured) {
                        query = query.eq('is_featured', true);
                    }

                    const { data, error } = await query;

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('获取商品失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 获取单个商品
             */
            async getById(productId) {
                try {
                    const client = window.supabaseClient;
                    // Default products for fallback
                    const mockProducts = {
                        'product_divination': {
                            id: 'product_divination',
                            name: 'AI Divination',
                            name_en: 'AI Divination',
                            price: 0.99,
                            description: 'Single AI Divination reading'
                        },
                        'product_fengshui': {
                            id: 'product_fengshui',
                            name: 'Feng Shui Analysis',
                            name_en: 'Feng Shui Analysis',
                            price: 1.99,
                            description: 'Single Feng Shui analysis'
                        },
                        'product_iching': {
                            id: 'product_iching',
                            name: 'I-Ching Wisdom',
                            name_en: 'I-Ching Wisdom',
                            price: 2.99,
                            description: 'Single I-Ching consultation'
                        }
                    };

                    if (!client) {
                        console.warn('Supabase未初始化，使用模拟数据');
                        return { success: true, data: mockProducts[productId] };
                    }

                    const { data, error } = await client
                        .from('products')
                        .select('*')
                        .eq('id', productId)
                        .single();

                    if (error) {
                        console.warn('Database query failed, falling back to mock:', error);
                        // Fallback to mock data if product not found in DB or DB error
                        if (mockProducts[productId]) {
                            return { success: true, data: mockProducts[productId] };
                        }
                        throw error;
                    }
                    return { success: true, data };
                } catch (error) {
                    console.error('获取商品详情失败:', error);
                    // Final fallback attempt
                    const mockProducts = {
                        'product_divination': { id: 'product_divination', price: 0.99, name: 'AI Divination' },
                        'product_fengshui': { id: 'product_fengshui', price: 1.99, name: 'Feng Shui Analysis' },
                        'product_iching': { id: 'product_iching', price: 2.99, name: 'I-Ching Wisdom' }
                    };
                    if (mockProducts[productId]) {
                        return { success: true, data: mockProducts[productId] };
                    }
                    return { success: false, error: error.message };
                }
            }
        },

        /**
         * 购物车管理
         */
        cart: {
            /**
             * 添加到购物车
             */
            async add(productId, quantity = 1) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    // 检查是否已存在
                    const { data: existing } = await client
                        .from('cart_items')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('product_id', productId)
                        .single();

                    if (existing) {
                        // 更新数量
                        const { data, error } = await client
                            .from('cart_items')
                            .update({ quantity: existing.quantity + quantity })
                            .eq('id', existing.id)
                            .select()
                            .single();

                        if (error) throw error;
                        return { success: true, data };
                    } else {
                        // 新增
                        const { data, error } = await client
                            .from('cart_items')
                            .insert({
                                user_id: user.id,
                                product_id: productId,
                                quantity
                            })
                            .select()
                            .single();

                        if (error) throw error;
                        return { success: true, data };
                    }
                } catch (error) {
                    console.error('添加到购物车失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 获取购物车
             */
            async get() {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    const { data, error } = await client
                        .from('cart_items')
                        .select(`
                            *,
                            products (*)
                        `)
                        .eq('user_id', user.id);

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('获取购物车失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 更新购物车商品数量
             */
            async updateQuantity(cartItemId, quantity) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    if (quantity <= 0) {
                        return await this.remove(cartItemId);
                    }

                    const { data, error } = await client
                        .from('cart_items')
                        .update({ quantity })
                        .eq('id', cartItemId)
                        .select()
                        .single();

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('更新购物车失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 删除购物车商品
             */
            async remove(cartItemId) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const { error } = await client
                        .from('cart_items')
                        .delete()
                        .eq('id', cartItemId);

                    if (error) throw error;
                    return { success: true };
                } catch (error) {
                    console.error('删除购物车商品失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 清空购物车
             */
            async clear() {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    const { error } = await client
                        .from('cart_items')
                        .delete()
                        .eq('user_id', user.id);

                    if (error) throw error;
                    return { success: true };
                } catch (error) {
                    console.error('清空购物车失败:', error);
                    return { success: false, error: error.message };
                }
            }
        },

        /**
         * 订单管理
         */
        orders: {
            /**
             * 创建订单
             */
            async create(orderData) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    // 生成订单号
                    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

                    // 创建订单
                    const { data: order, error: orderError } = await client
                        .from('orders')
                        .insert({
                            user_id: user.id,
                            order_number: orderNumber,
                            ...orderData
                        })
                        .select()
                        .single();

                    if (orderError) throw orderError;

                    return { success: true, data: order };
                } catch (error) {
                    console.error('创建订单失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 获取用户订单
             */
            async getUserOrders(limit = 10, offset = 0) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    const { data, error } = await client
                        .from('orders')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .range(offset, offset + limit - 1);

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('获取订单失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 获取订单详情
             */
            async getById(orderId) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const { data, error } = await client
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                products (*)
                            )
                        `)
                        .eq('id', orderId)
                        .single();

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('获取订单详情失败:', error);
                    return { success: false, error: error.message };
                }
            }
        },

        /**
         * 收货地址管理
         */
        addresses: {
            /**
             * 获取用户地址
             */
            async getAll() {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    const { data, error } = await client
                        .from('shipping_addresses')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('is_default', { ascending: false });

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('获取地址失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 添加地址
             */
            async add(addressData) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const user = await window.EnhancedAuthService.getCurrentUser();
                    if (!user) throw new Error('请先登录');

                    const { data, error } = await client
                        .from('shipping_addresses')
                        .insert({
                            user_id: user.id,
                            ...addressData
                        })
                        .select()
                        .single();

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('添加地址失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 更新地址
             */
            async update(addressId, addressData) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const { data, error } = await client
                        .from('shipping_addresses')
                        .update(addressData)
                        .eq('id', addressId)
                        .select()
                        .single();

                    if (error) throw error;
                    return { success: true, data };
                } catch (error) {
                    console.error('更新地址失败:', error);
                    return { success: false, error: error.message };
                }
            },

            /**
             * 删除地址
             */
            async delete(addressId) {
                try {
                    const client = window.supabaseClient;
                    if (!client) throw new Error('Supabase未初始化');

                    const { error } = await client
                        .from('shipping_addresses')
                        .delete()
                        .eq('id', addressId);

                    if (error) throw error;
                    return { success: true };
                } catch (error) {
                    console.error('删除地址失败:', error);
                    return { success: false, error: error.message };
                }
            }
        }
    };

    // 导出到全局
    window.ShopService = ShopService;

})();
