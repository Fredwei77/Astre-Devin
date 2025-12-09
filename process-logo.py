#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
去除图片白边脚本
"""

import sys
import os

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("❌ 需要安装PIL库")
    print("\n安装命令:")
    print("pip install Pillow numpy")
    print("\n或者:")
    print("python -m pip install Pillow numpy")
    sys.exit(1)

def remove_white_background(input_path, output_path, threshold=240):
    """
    去除图片白边
    threshold: RGB阈值，大于此值的像素将被视为白色
    """
    try:
        # 打开图片
        img = Image.open(input_path)
        
        # 转换为RGBA模式
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # 转换为numpy数组
        data = np.array(img)
        
        # 获取RGB通道
        r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
        
        # 判断白色像素（RGB都大于阈值）
        white_mask = (r > threshold) & (g > threshold) & (b > threshold)
        
        # 将白色像素的alpha通道设为0（透明）
        a[white_mask] = 0
        
        # 更新alpha通道
        data[:, :, 3] = a
        
        # 转换回PIL Image
        result = Image.fromarray(data, 'RGBA')
        
        # 保存为PNG（支持透明）
        result.save(output_path, 'PNG')
        
        print(f"✅ 处理完成: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ 处理失败: {e}")
        return False

if __name__ == '__main__':
    input_file = os.path.join('resources', 'logo eyes.png')
    output_file = os.path.join('resources', 'logo-processed.png')
    
    if not os.path.exists(input_file):
        print(f"❌ 文件不存在: {input_file}")
        print("\n需要资料:")
        print("1. 上传的logo图片文件路径")
        print("2. 确认文件是否在resources目录")
        sys.exit(1)
    
    print(f"处理图片: {input_file}")
    success = remove_white_background(input_file, output_file)
    
    if success:
        print(f"\n✅ 处理完成！输出文件: {output_file}")
        print("现在可以替换HTML文件中的logo引用")
    else:
        print("\n❌ 处理失败，请检查图片文件")
