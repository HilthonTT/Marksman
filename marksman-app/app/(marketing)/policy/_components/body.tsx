"use client";

import { ChevronDownCircle } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export const Body = () => {
  return (
    <>
      <Separator className="my-4" />
      <div className="mt-4 space-y-4">
        <summary className="flex items-center">
          <ChevronDownCircle className="h-8 w-8 mr-2" />
          <span className="text-2xl">Welcome to the Roblox Privacy Policy</span>
        </summary>
        <div className="flex items-center gap-2">
          <div className="w-1 opacity-20 h-8 bg-emerald-500" />
          <p className="text-muted-foreground font-bold text-lg">
            Welcome to the Roblox universe, where imagination and creativity
            rule!
          </p>
        </div>

        <div className="text-sm text-neutral-400">
          <ul className="list-disc pl-6 mb-4 space-y-4">
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              eget lectus at sem varius lacinia.
            </li>
            <li>
              Fusce nec enim ut nunc volutpat auctor. Morbi nec commodo odio.
              Duis aliquam nunc quis velit dictum, nec consectetur metus
              commodo.
            </li>
            <li>
              Sed luctus arcu at congue gravida. Nulla facilisi. Aliquam erat
              volutpat. Sed lobortis tincidunt dolor, id tincidunt tortor
              vehicula sit amet.
            </li>
            <li>
              Suspendisse potenti. Aenean vel ante vestibulum, fermentum purus
              et, scelerisque ligula. Sed hendrerit sollicitudin orci, vitae
              fringilla arcu tincidunt at.
            </li>
            <li>
              In hac habitasse platea dictumst. Curabitur aliquam dapibus
              libero, eu euismod nulla viverra sit amet. Nulla facilisi.
              Vestibulum interdum ligula a efficitur.
            </li>
            <li>
              Mauris convallis sapien nec felis feugiat, a consequat enim
              cursus. Morbi at ligula mi. Phasellus tempus nunc sed sapien
              aliquet, sed egestas odio tempor.
            </li>
            <li>
              Donec eu lectus cursus, convallis lectus sed, rutrum turpis.
              Integer eget sodales ex. Proin sed elit a tortor ultricies
              pretium.
            </li>
            <li>
              Phasellus convallis purus in mi mattis, a bibendum velit
              elementum. Mauris ut augue sed ipsum tincidunt varius nec nec
              orci.
            </li>
            <li>
              Nulla facilisi. Integer at varius sapien. Nulla facilisi. Duis non
              magna id leo cursus lacinia. Sed sit amet urna ut arcu
              pellentesque fringilla id id neque.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
