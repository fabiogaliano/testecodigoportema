<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-indigo-300"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                data-tags="car,automobile,travel"
              >
                <g fill="#a3bffa" transform="scale(0.03125 0.03125)">
                  <path
                    d="M864 704h-736c-35.328 0-64-28.672-64-64v-160c0-35.328 28.672-64 64-64h32c0 0 47.328-144 61.312-192s28.672-64 64.032-64h421.312c35.328 0 46.016 9.984 64 64s61.344 192 61.344 192h32c35.328 0 64 28.672 64 64v160c0 35.328-28.672 64-64 64zM288 640h416v-32h-416v32zM704 416c0-35.328-28.672-68-64-68s-64 32.672-64 68c0 0.832 128 0.832 128 0zM288 576h416v-32h-416v32zM288 512h416v-32h-416v32zM129.984 544c0 35.328 28.672 64 64 64s64-28.672 64-64-28.672-64-64-64-64 28.672-64 64zM738.656 224c-8-22.016-14.304-32-32-32h-194.656v32h16c8.832 0 16 7.168 16 16s-7.168 16-16 16h-64c-8.832 0-16-7.168-16-16s7.168-16 16-16h16v-32h-194.656c-17.696 0-24.032 4-32 32-8.032 28-61.344 192-61.344 192h366.72c0.736-43.648 36.16-84.576 79.84-84.576 43.712 0 79.104 40.896 79.872 84.576h81.568c0 0-53.344-169.984-61.344-192zM798.016 481.984c-35.328 0-64 28.672-64 64s28.672 64 64 64 64-28.672 64-64-28.672-64-64-64zM224 816c0 26.496-21.504 48-48 48s-48-21.504-48-48v-80h96v80zM864 816c0 26.496-21.504 48-48 48s-48-21.504-48-48v-80h96v80z"
                  />
                </g>
              </svg>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a
                  v-for="item in navigation"
                  :key="item.name"
                  @click="handleClick(item)"
                  :class="[
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  ]"
                  :aria-current="item.current ? 'page' : undefined"
                  >{{ item.name }}</a
                >
              </div>
            </div>
          </div>

          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon
                v-if="!open"
                class="block h-6 w-6 text-indigo-300"
                aria-hidden="true"
              />
              <XMarkIcon
                v-else
                class="block h-6 w-6 text-indigo-300"
                aria-hidden="true"
              />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <DisclosureButton
            v-for="item in navigation"
            @click="handleClick(item)"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            ]"
            :aria-current="item.current ? 'page' : undefined"
            >{{ item.name }}</DisclosureButton
          >
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue';
  import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
  import { useMenuStore } from '../stores/menu';
  import { ref } from 'vue';

  const menuStore = useMenuStore();

  const navigation = ref([
    { name: 'Menu', current: false },
    { name: 'Estatísticas', current: false },
  ]);

  function handleClick(navItem) {
    switch (navItem.name) {
      case 'Menu':
        if (navItem.current === false) {
          menuStore.setSelectedCategory();
        }
        break;

      default:
        break;
    }
  }
</script>
