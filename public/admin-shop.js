/**
 * 商品管理后台
 * Admin Shop Management
 */

(function() {
    'use strict';

    class AdminShop {
        constructor() {
            this.products = [];
            this.orders = [];
            this.init();
        }

        async init() {
            await this.loadProducts();
            await this.loadOrders();
            this.setupEventListeners();
        }

        /**
         * 加载商品列表
         */
        async loadProducts() {
            try {
                const client = window.supabaseClient;
                const { data, error } = await client
                    .from('products')
                    .select('*')
                    .order('sort_order', { ascending: true });

                if (error) throw error;

                this.products = data || [];
                this.renderProducts();
            } catch (error) {
                console.error('加载商品失败:', error);
            }
        }

        /**
         * 渲染商品列表
         */
        renderProducts() {
            const container = document.getElementById('productsList');
            if (!container) return;

            if (this.products.length === 0) {
                container.innerHTML = '<p class="text-gray-400">暂无商品</p>';
                return;
            }

            container.innerHTML = this.products.map(product => `
                <div class="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                    ${product.image_url ? `
                        <img src="${product.image_url}" alt="${product.name}" 
                             class="w-20 h-20 object-cover rounded-lg border border-white/20">
                    ` : `
                        <div class="w-20 h-20 flex items-center justify-center text-3xl bg-white/10 rounded-lg">
                            ${product.icon || '🎁'}
                        </div>
                    `}
                    <div class="flex-1">
                        <h3 class="font-bold">${product.name} / ${product.name_en}</h3>
                        <p class="text-sm text-gray-400">${product.description || ''}</p>
                        <div class="flex gap-4 mt-2 text-sm">
                            <span>价格: $${product.price}</span>
                            <span>库存: ${product.stock}</span>
                            <span class="px-2 py-1 rounded ${product.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                                ${product.is_active ? '启用' : '禁用'}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="adminShop.editProduct('${product.id}')" 
                                class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminShop.deleteProduct('${product.id}')" 
                                class="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        /**
         * 保存商品
         */
        async saveProduct(formData) {
            try {
                const client = window.supabaseClient;
                const productId = formData.get('id');

                const productData = {
                    name: formData.get('name'),
                    name_en: formData.get('name_en'),
                    description: formData.get('description'),
                    category: formData.get('category'),
                    icon: formData.get('icon') || '🎁',
                    price: parseFloat(formData.get('price')),
                    original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : null,
                    stock: parseInt(formData.get('stock')),
                    sort_order: parseInt(formData.get('sort_order')) || 0,
                    is_active: formData.get('is_active') === 'true',
                    is_featured: formData.get('is_featured') === 'true'
                };

                // 添加图片URL（如果有）
                if (formData.get('image_url')) {
                    productData.image_url = formData.get('image_url');
                }

                let result;
                if (productId) {
                    // 更新
                    result = await client
                        .from('products')
                        .update(productData)
                        .eq('id', productId);
                } else {
                    // 新增
                    result = await client
                        .from('products')
                        .insert(productData);
                }

                if (result.error) throw result.error;

                alert('保存成功！');
                this.resetForm();
                await this.loadProducts();
            } catch (error) {
                console.error('保存失败:', error);
                alert('保存失败: ' + error.message);
            }
        }

        /**
         * 编辑商品
         */
        editProduct(productId) {
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productNameEn').value = product.name_en || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productIcon').value = product.icon || '';
            document.getElementById('productImageUrl').value = product.image_url || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOriginalPrice').value = product.original_price || '';
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productSortOrder').value = product.sort_order || 0;
            document.getElementById('productIsActive').checked = product.is_active;
            document.getElementById('productIsFeatured').checked = product.is_featured;

            // 显示图片预览
            if (product.image_url) {
                this.updateImagePreview(product.image_url);
            }

            // 滚动到表单
            document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
        }

        /**
         * 删除商品
         */
        async deleteProduct(productId) {
            if (!confirm('确定要删除这个商品吗？')) return;

            try {
                const client = window.supabaseClient;
                const { error } = await client
                    .from('products')
                    .delete()
                    .eq('id', productId);

                if (error) throw error;

                alert('删除成功！');
                await this.loadProducts();
            } catch (error) {
                console.error('删除失败:', error);
                alert('删除失败: ' + error.message);
            }
        }

        /**
         * 重置表单
         */
        resetForm() {
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            
            // 清除图片预览
            const preview = document.getElementById('imagePreview');
            if (preview) {
                preview.innerHTML = '<span class="text-gray-500 text-sm">预览</span>';
            }
        }

        /**
         * 加载订单列表
         */
        async loadOrders() {
            try {
                const client = window.supabaseClient;
                const { data, error } = await client
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            products (*)
                        )
                    `)
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;

                this.orders = data || [];
                this.renderOrders();
            } catch (error) {
                console.error('加载订单失败:', error);
            }
        }

        /**
         * 渲染订单列表
         */
        renderOrders() {
            const container = document.getElementById('ordersList');
            if (!container) return;

            if (this.orders.length === 0) {
                container.innerHTML = '<p class="text-gray-400">暂无订单</p>';
                return;
            }

            const statusColors = {
                pending: 'bg-yellow-500/20 text-yellow-400',
                paid: 'bg-green-500/20 text-green-400',
                processing: 'bg-blue-500/20 text-blue-400',
                shipped: 'bg-purple-500/20 text-purple-400',
                delivered: 'bg-green-500/20 text-green-400',
                cancelled: 'bg-red-500/20 text-red-400'
            };

            const statusNames = {
                pending: '待支付',
                paid: '已支付',
                processing: '处理中',
                shipped: '已发货',
                delivered: '已送达',
                cancelled: '已取消'
            };

            container.innerHTML = this.orders.map(order => `
                <div class="bg-white/5 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold">订单号: ${order.order_number}</h3>
                            <p class="text-sm text-gray-400">${new Date(order.created_at).toLocaleString('zh-CN')}</p>
                        </div>
                        <span class="px-3 py-1 rounded ${statusColors[order.status]}">
                            ${statusNames[order.status]}
                        </span>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <p class="text-sm"><strong>收货人:</strong> ${order.recipient_name}</p>
                            <p class="text-sm"><strong>电话:</strong> ${order.recipient_phone}</p>
                        </div>
                        <div>
                            <p class="text-sm"><strong>地址:</strong> ${order.shipping_address}</p>
                            <p class="text-sm"><strong>金额:</strong> $${order.total_amount}</p>
                        </div>
                    </div>

                    ${order.order_items && order.order_items.length > 0 ? `
                        <div class="bg-white/5 rounded p-3 mb-3">
                            <p class="text-sm font-semibold mb-2">订单商品:</p>
                            ${order.order_items.map(item => `
                                <p class="text-sm text-gray-300">
                                    ${item.product_name} × ${item.quantity} = $${item.subtotal}
                                </p>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="flex gap-2">
                        <select onchange="adminShop.updateOrderStatus('${order.id}', this.value)" 
                                class="bg-white/10 border border-white/30 rounded px-3 py-1 text-sm">
                            <option value="">更改状态...</option>
                            <option value="paid">已支付</option>
                            <option value="processing">处理中</option>
                            <option value="shipped">已发货</option>
                            <option value="delivered">已送达</option>
                            <option value="cancelled">已取消</option>
                        </select>
                    </div>
                </div>
            `).join('');
        }

        /**
         * 更新订单状态
         */
        async updateOrderStatus(orderId, newStatus) {
            if (!newStatus) return;

            try {
                const client = window.supabaseClient;
                const { error } = await client
                    .from('orders')
                    .update({ status: newStatus })
                    .eq('id', orderId);

                if (error) throw error;

                alert('状态更新成功！');
                await this.loadOrders();
            } catch (error) {
                console.error('更新状态失败:', error);
                alert('更新失败: ' + error.message);
            }
        }

        /**
         * 上传图片到 Supabase Storage
         */
        async uploadImage(file) {
            try {
                const client = window.supabaseClient;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { data, error } = await client.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (error) throw error;

                // 获取公开URL
                const { data: urlData } = client.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                return urlData.publicUrl;
            } catch (error) {
                console.error('上传图片失败:', error);
                return null;
            }
        }

        /**
         * 设置事件监听
         */
        setupEventListeners() {
            const form = document.getElementById('productForm');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const formData = new FormData();
                    formData.append('id', document.getElementById('productId').value);
                    formData.append('name', document.getElementById('productName').value);
                    formData.append('name_en', document.getElementById('productNameEn').value);
                    formData.append('description', document.getElementById('productDescription').value);
                    formData.append('category', document.getElementById('productCategory').value);
                    formData.append('icon', document.getElementById('productIcon').value);
                    formData.append('price', document.getElementById('productPrice').value);
                    formData.append('original_price', document.getElementById('productOriginalPrice').value);
                    formData.append('stock', document.getElementById('productStock').value);
                    formData.append('sort_order', document.getElementById('productSortOrder').value);
                    formData.append('is_active', document.getElementById('productIsActive').checked);
                    formData.append('is_featured', document.getElementById('productIsFeatured').checked);

                    // 处理图片上传
                    const imageFile = document.getElementById('productImageFile').files[0];
                    const imageUrl = document.getElementById('productImageUrl').value;

                    if (imageFile) {
                        // 上传文件
                        const uploadedUrl = await this.uploadImage(imageFile);
                        if (uploadedUrl) {
                            formData.append('image_url', uploadedUrl);
                        }
                    } else if (imageUrl) {
                        // 使用URL
                        formData.append('image_url', imageUrl);
                    }

                    this.saveProduct(formData);
                });
            }

            // 图片预览 - 文件上传
            const imageFileInput = document.getElementById('productImageFile');
            if (imageFileInput) {
                imageFileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.updateImagePreview(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // 图片预览 - URL输入
            const imageUrlInput = document.getElementById('productImageUrl');
            if (imageUrlInput) {
                imageUrlInput.addEventListener('input', (e) => {
                    const url = e.target.value;
                    if (url) {
                        this.updateImagePreview(url);
                    }
                });
            }
        }

        /**
         * 更新图片预览
         */
        updateImagePreview(src) {
            const preview = document.getElementById('imagePreview');
            if (preview) {
                preview.innerHTML = `<img src="${src}" alt="预览" class="w-full h-full object-cover">`;
            }
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.adminShop = new AdminShop();
        });
    } else {
        window.adminShop = new AdminShop();
    }

})();
